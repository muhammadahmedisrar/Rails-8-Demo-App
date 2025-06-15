class AddOtpSecretAndOtpEnabledToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :otp_secret, :string
    add_column :users, :otp_enabled, :boolean, default: false
  end
end
