require "rotp"

class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  def generate_otp_secret
    self.otp_secret = ROTP::Base32.random_base32
    save!
  end

  def provisioning_uri
    label = "YourAppName:#{email_address}"
    issuer = "YourAppName"
    ROTP::TOTP.new(otp_secret, issuer: issuer).provisioning_uri(label)
  end

  def verify_otp(code)
    totp = ROTP::TOTP.new(otp_secret)
    totp.verify(code, drift_behind: 30)
  end
end
