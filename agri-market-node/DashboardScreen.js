import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet, Image } from "react-native";
import axios from "axios";
import io from "socket.io-client";

const SERVER_URL = "http://192.168.8.123:3000"; // Your backend IP

const DashboardScreen = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", price: "", quantity: "", unit: "lb",
    category: "Vegetables", description: "", image: ""
  });
  const [socket, setSocket] = useState(null);

  // --- Initialize Socket.IO ---
  useEffect(() => {
    const s = io(SERVER_URL);
    setSocket(s);

    // Listen for new products
    s.on("new-product", (product) => {
      setProducts((prev) => [product, ...prev]);
    });

    return () => s.disconnect();
  }, []);

  // --- Fetch products from backend ---
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/products`);
      if (res.data.status) setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch products error:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Add product ---
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post(`${SERVER_URL}/products`, {
        ...newProduct,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        farmerName: user.name,
        location: user.location,
        createdAt: new Date(),
      });

      if (res.data.status) {
        alert(`${newProduct.name} added successfully!`);
        setNewProduct({
          name: "", price: "", quantity: "", unit: "lb",
          category: "Vegetables", description: "", image: ""
        });
        setShowAddProductModal(false);

        // Emit via Socket.IO to notify other clients
        socket?.emit("new-product", res.data.product);
      }
    } catch (err) {
      console.error("Add product error:", err.message);
      alert("Failed to add product. Check server & network connection.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome back, {user.name}</Text>

      <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddProductModal(true)}>
        <Text style={styles.addBtnText}>Add New Product ➕</Text>
      </TouchableOpacity>

      {products.map((p) => (
        <View key={p._id} style={styles.productCard}>
          {p.image ? <Image source={{ uri: p.image }} style={styles.productImage} /> : null}
          <Text style={styles.productName}>{p.name}</Text>
          <Text>Price: ${p.price} | Quantity: {p.quantity} {p.unit}</Text>
          <Text>Farmer: {p.farmerName} 📍 {p.location}</Text>
          <Text>Category: {p.category}</Text>
        </View>
      ))}

      {/* Add Product Modal */}
      <Modal visible={showAddProductModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Product</Text>
            {["name","price","quantity","unit","category","description","image"].map((field) => (
              <TextInput
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                style={styles.input}
                value={newProduct[field]}
                onChangeText={(text) => setNewProduct({ ...newProduct, [field]: text })}
              />
            ))}
            <TouchableOpacity style={styles.modalBtn} onPress={handleAddProduct}>
              <Text style={styles.modalBtnText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#ccc", marginTop: 8 }]} onPress={() => setShowAddProductModal(false)}>
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  addBtn: { backgroundColor: "#D1FAE5", padding: 12, borderRadius: 8, marginBottom: 16 },
  addBtnText: { color: "#047857", fontWeight: "600" },
  productCard: { padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8 },
  productImage: { width: "100%", height: 150, borderRadius: 8, marginBottom: 8 },
  productName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 16 },
  modal: { backgroundColor: "#fff", borderRadius: 8, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 6, padding: 10, marginBottom: 12 },
  modalBtn: { backgroundColor: "#16A34A", padding: 12, borderRadius: 8, alignItems: "center" },
  modalBtnText: { color: "#fff", fontWeight: "600" },
});
