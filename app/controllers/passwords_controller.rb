class PasswordsController < ApplicationController
  allow_unauthenticated_access
  before_action :set_user_by_token, only: %i[ edit update ]

  def new
  end

  def create
    if user = User.find_by(email_address: params[:email_address])
      PasswordsMailer.reset(user).deliver_later
    end

    render json: { message: "Password reset instructions sent to the email" }, status: 200
  end

  def edit
  end

  def update
    if @user.update(params.permit(:password, :password_confirmation))
      render json: { message: "Password has been reset." }, status: 200
    else
      render json: { message: "Issue Reseting the Password." }, status: 400
    end
  end

  private
    def set_user_by_token
      @user = User.find_by_password_reset_token!(params[:id])
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      redirect_to root_path, alert: "Password reset link is invalid or has expired."
    end
end
