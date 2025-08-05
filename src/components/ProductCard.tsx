import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../store";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  showAddButton?: boolean;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  showAddButton = true,
}) => {
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    onAddToCart();
  };

  const handleCardPress = () => {
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            contentFit="contain"
            placeholder="L5H2rKBofZ#oaym4NWj?d"
            transition={200}
          />

          {product.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{product.rating.rate}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.category} numberOfLines={1}>
            {product.category}
          </Text>

          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>

          <View style={styles.footer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>

            {showAddButton && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToCart}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#007AFF", "#0056CC"]}
                  style={styles.addButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 120,
    backgroundColor: "#F8F9FA",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ratingContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 2,
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: "#8E8E93",
    textTransform: "uppercase",
    fontWeight: "500",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  addButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  addButtonGradient: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
