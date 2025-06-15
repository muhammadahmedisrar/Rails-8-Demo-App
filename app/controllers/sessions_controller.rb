class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create signup verify_otp ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }

  def new
  end

  def create
    if user = User.authenticate_by(params.permit(:email_address, :password))
      if user.otp_enabled
        session[:pre_2fa_user_id] = user.id
        return render json: { message: "OTP required", redirect_url: "/verify-otp-form" }, status: :ok
      end
      start_new_session_for user
      render json: { message: "User authenticated", redirect_url: after_authentication_url }, status: 200
    else
      render json: { error: "User not found" }, status: 401
    end
  end

  def verify_otp
    user = User.find(session[:pre_2fa_user_id])

    if (params[:otp_code] && user&.verify_otp(params[:otp_code])) || (session[:recovery_code] && session[:recovery_code] == params[:recovery_code] && Time.current - Time.parse(session[:recovery_code_sent_at]) < 300)
      start_new_session_for user
      session.delete(:pre_2fa_user_id)
      session.delete(:recovery_code)
      session.delete(:recovery_code_sent_at)
      render json: { message: "User authenticated", redirect_url: after_authentication_url }, status: 200
    else
      render json: { error: "Invalid Code, try again!", redirect_url: "" }, status: 400
    end
  end

  def destroy
    terminate_session
    head :no_content
  end

  def signup
    user = User.new(email_address: params[:email_address], password: params[:password])
    if user.save
      render json: { message: "User created successfully" }, status: :created
    else
      render json: { error: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
