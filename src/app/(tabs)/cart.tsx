import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { useAppStore } from "../../store";
import { showToast } from "../../utils/toast";

export default function CartScreen() {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    user,
    logout,
  } = useAppStore();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    const product = cartItems.find((item) => item.product.id === productId);
    if (product) {
      removeFromCart(productId);
      showToast.info(`${product.product.title} removed from cart`, "Removed");
    }
  };

  const handleClearCart = () => {
    clearCart();
    showToast.warning("Cart cleared successfully", "Cleared");
  };

  const handleCheckout = () => {
    const total = (
      cartTotal +
      (cartTotal > 50 ? 0 : 5.99) +
      cartTotal * 0.08
    ).toFixed(2);
    showToast.success(
      `Order placed successfully! Total: $${total}`,
      "Checkout Complete"
    );
    clearCart();
  };

  const handleLogout = () => {
    logout();
    showToast.info("Logged out successfully", "Logged out");
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.itemImage}
        contentFit="contain"
        placeholder="L5H2rKBofZ#oaym4NWj?d"
      />

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity - 1)
            }
          >
            <Ionicons name="remove" size={16} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleQuantityChange(item.product.id, item.quantity + 1)
            }
          >
            <Ionicons name="add" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.product.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={80} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some products to your cart to see them here.
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={["#007AFF", "#0056CC"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Shopping Cart</Text>
            <Text style={styles.headerSubtitle}>
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderFooter = () => {
    if (cartItems.length === 0) return null;

    return (
      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {cartTotal > 50 ? "Free" : "$5.99"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>
              ${(cartTotal * 0.08).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              $
              {(
                cartTotal +
                (cartTotal > 50 ? 0 : 5.99) +
                cartTotal * 0.08
              ).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Clear Cart"
            onPress={handleClearCart}
            variant="outline"
            style={styles.clearButton}
          />

          <Button
            title="Checkout"
            onPress={handleCheckout}
            style={styles.checkoutButton}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {renderHeader()}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyCart}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: "center",
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  summary: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#8E8E93",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#007AFF",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  clearButton: {
    flex: 1,
  },
  checkoutButton: {
    flex: 2,
  },
});
