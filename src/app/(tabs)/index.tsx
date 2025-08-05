import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { ProductCard } from "../../components/ProductCard";
import { ProductDetailsSheet } from "../../components/ProductDetailsSheet";
import { useAppStore } from "../../store";
import { showToast } from "../../utils/toast";

export default function ProductsScreen() {
  const {
    products,
    isLoading,
    fetchProducts,
    addToCart,
    selectedProduct,
    setSelectedProduct,
    cartItems,
  } = useAppStore();

  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    showToast.success(`${product.title} added to cart`, "Added to cart");
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const isProductInCart = (productId: number) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      onAddToCart={() => handleAddToCart(item)}
    />
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
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appTitle}>ShopCart</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            activeOpacity={0.7}
          >
            <View style={styles.cartBadge}>
              <Ionicons name="bag" size={24} color="#FFFFFF" />
              {cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No Products Found" : "No Products Available"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `No products match "${searchQuery}". Try a different search term.`
          : "We couldn't find any products at the moment."}
      </Text>
      <Button
        title="Refresh"
        onPress={handleRefresh}
        variant="outline"
        style={styles.refreshButton}
      />
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading products...</Text>
    </View>
  );

  if (isLoading && products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <ProductDetailsSheet
        product={selectedProduct}
        visible={!!selectedProduct}
        onClose={handleCloseDetails}
        onAddToCart={() => {
          if (selectedProduct) {
            handleAddToCart(selectedProduct);
          }
        }}
        isInCart={selectedProduct ? isProductInCart(selectedProduct.id) : false}
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
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cartBadge: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,

    minHeight: 44,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#8E8E93",
    marginLeft: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#8E8E93",
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
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
    marginBottom: 24,
  },
  refreshButton: {
    width: 120,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 16,
  },
});
