require "test_helper"

class ProductTest < ActiveSupport::TestCase
  # Test 1: validazione prodotto valido
  test "should be valid with valid attributes" do
    product = Product.new(
      title: "Valid Product",
      description: "A valid product",
      price: 99.99,
      original_price: 129.99,
      quantity: 5
    )
    assert product.valid?, "Product should be valid with all required attributes"
  end

  # Test 2: validazione prezzo negativo
  test "should not be valid with negative price" do
    product = Product.new(
      title: "Invalid Product",
      description: "Product with negative price",
      price: -10.0,
      original_price: 129.99,
      quantity: 5
    )
    assert_not product.valid?, "Product should not be valid with negative price"
    assert_includes product.errors[:price], "must be greater than 0"
  end
end
