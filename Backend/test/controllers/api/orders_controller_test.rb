require "test_helper"

module Api
  class OrdersControllerTest < ActionDispatch::IntegrationTest
    # Helper per generare token JWT per i test
    def generate_token(user)
      payload = { user_id: user.id }
      JWT.encode(payload, Rails.application.secret_key_base, 'HS256')
    end

    # Test 1: creazione ordine con successo
    test "should create order with valid parameters" do
      user = users(:regular_user)
      product = products(:valid_product)
      token = generate_token(user)

      order_params = {
        order: {
          customer: {
            firstName: "Mario",
            lastName: "Rossi",
            email: "mario.rossi@example.com"
          },
          address: {
            street: "Via Roma 123",
            city: "Milano",
            zip: "20100"
          },
          total: 99.99,
          items: [
            {
              id: product.id,
              title: product.title,
              price: product.price,
              quantity: 2
            }
          ]
        }
      }

      assert_difference('Order.count', 1) do
        post api_orders_url,
          params: order_params,
          headers: { 'Authorization': "Bearer #{token}" },
          as: :json
      end

      assert_response :created
    end

    # Test 2: creazione ordine fallisce con quantità insufficiente
    test "should not create order with insufficient stock" do
      user = users(:regular_user)
      product = products(:valid_product)
      token = generate_token(user)

      order_params = {
        order: {
          customer: {
            firstName: "Mario",
            lastName: "Rossi",
            email: "mario.rossi@example.com"
          },
          address: {
            street: "Via Roma 123",
            city: "Milano",
            zip: "20100"
          },
          total: 999.90,
          items: [
            {
              id: product.id,
              title: product.title,
              price: product.price,
              quantity: 100  # > 10
            }
          ]
        }
      }

      assert_no_difference('Order.count') do
        post api_orders_url,
          params: order_params,
          headers: { 'Authorization': "Bearer #{token}" },
          as: :json
      end

      assert_response :unprocessable_entity
      json_response = JSON.parse(response.body)
      assert_includes json_response['error'], 'insufficient stock'
    end
  end
end
