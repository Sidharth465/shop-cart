import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Product } from "../store";
import { Button } from "./Button";

interface ProductDetailsSheetProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  isInCart?: boolean;
}

const { height, width } = Dimensions.get("window");

export const ProductDetailsSheet: React.FC<ProductDetailsSheetProps> = ({
  product,
  visible,
  onClose,
  onAddToCart,
  isInCart = false,
}) => {
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(height);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      sheetTranslateY.value = withTiming(0, { duration: 400 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 300 });
      sheetTranslateY.value = withTiming(height, { duration: 400 });
    }
  }, [visible, backdropOpacity, sheetTranslateY]);

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const sheetAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: sheetTranslateY.value }],
    };
  });

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <TouchableOpacity
            style={styles.backdropTouch}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View style={[styles.sheetContainer, sheetAnimatedStyle]}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.image}
                  contentFit="contain"
                  placeholder="L5H2rKBofZ#oaym4NWj?d"
                  transition={200}
                />
              </View>

              <View style={styles.details}>
                <View style={styles.header}>
                  <Text style={styles.category}>{product.category}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {product.rating.rate} ({product.rating.count} reviews)
                    </Text>
                  </View>
                </View>

                <Text style={styles.title}>{product.title}</Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                  {product.price > 50 && (
                    <View style={styles.freeShipping}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#34C759"
                      />
                      <Text style={styles.freeShippingText}>Free Shipping</Text>
                    </View>
                  )}
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>Description</Text>
                  <Text style={styles.description}>{product.description}</Text>
                </View>

                <View style={styles.features}>
                  <View style={styles.feature}>
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#34C759"
                    />
                    <Text style={styles.featureText}>Quality Guaranteed</Text>
                  </View>

                  <View style={styles.feature}>
                    <Ionicons
                      name="return-down-back"
                      size={20}
                      color="#007AFF"
                    />
                    <Text style={styles.featureText}>Easy Returns</Text>
                  </View>

                  <View style={styles.feature}>
                    <Ionicons name="card" size={20} color="#FF9500" />
                    <Text style={styles.featureText}>Secure Payment</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                title={isInCart ? "Already in Cart" : "Add to Cart"}
                onPress={onAddToCart}
                disabled={isInCart}
                variant={isInCart ? "secondary" : "primary"}
                size="large"
                style={styles.addButton}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouch: {
    flex: 1,
  },
  sheetContainer: {
    height: height * 0.8,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
    flex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 250,
    backgroundColor: "#F8F9FA",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    zIndex: 1000,
  },
  details: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    color: "#8E8E93",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    lineHeight: 30,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#007AFF",
  },
  freeShipping: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  freeShippingText: {
    fontSize: 12,
    color: "#34C759",
    fontWeight: "600",
    marginLeft: 4,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#3A3A3C",
    lineHeight: 24,
  },
  features: {
    marginBottom: 20,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#3A3A3C",
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    width: "100%",
    height: 50,
  },
});
