class TwoFactorAuthController < ApplicationController
  allow_unauthenticated_access only: %i[ recover_otp ]
  def setup
    Current.user.generate_otp_secret unless Current.user.otp_secret
    qr_code = RQRCode::QRCode.new(Current.user.provisioning_uri).as_svg(module_size: 4)
    render json: { qr_code: qr_code }
  end

  def verify
    if Current.user
      Current.user.update(otp_enabled: true)
      render json: { message: "Two-factor authentication enabled successfully." }, status: 200
    else
      render json: { error: "Invalid OTP code. Please try again." }, status: 400
    end
  end

  def disable
    Current.user.update(otp_enabled: false, otp_secret: nil)
    render json: { message: "Two-factor authentication disabled." }, status: 200
  end

  def recover_otp
    user_id = session[:pre_2fa_user_id]
    user = User.find_by(id: user_id)
    if user
      if params[:email_address] == user.email_address
        recovery_code = SecureRandom.hex(3)
        session[:recovery_code] = recovery_code
        session[:recovery_code_sent_at] = Time.current
        PasswordsMailer.recovery_code(user, recovery_code).deliver_later
        render json: { message: "Code sent to your email." }, status: 200
      else
        render json: { error: "Email address does not match." }, status: 400
      end
    else
      render json: { error: "User not found." }, status: 404
    end
  end
end
