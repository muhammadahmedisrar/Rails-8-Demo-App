class PasswordsMailer < ApplicationMailer
  include Rails.application.routes.url_helpers
  def reset(user)
    @user = user
    @reset_link = "#{ENV["APP_BASE_URL"]}/reset_password/#{@user.password_reset_token}"
    mail subject: "Reset your password", to: user.email_address
  end

  def recovery_code(user, recovery_code)
    @user = user
    @recovery_code = recovery_code
    mail subject: "Your OTP Recovery Code", to: user.email_address
  end
end
