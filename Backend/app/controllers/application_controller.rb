class ApplicationController < ActionController::API
  include Pagy::Backend

  attr_reader :current_user

  private

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header

    begin
      decoded = JWT.decode(header, Rails.application.secret_key_base, true, { algorithm: 'HS256' })
      @current_user = User.find(decoded[0]['user_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      @current_user = nil
    end
  end

  def require_authentication!
    authenticate_request
    render json: { error: 'Not authenticated' }, status: :unauthorized unless current_user
  end

  def require_admin!
    authenticate_request
    render json: { error: 'Access denied. Admin only.' }, status: :forbidden unless current_user&.admin?
  end
end
