Rails.application.routes.draw do
  # resource :session
  # resources :passwords, param: :token
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  post "login", to: "sessions#create"
  post "signup", to: "sessions#signup"
  delete "logout", to: "sessions#destroy"
  post "signup", to: "sessions#signup"
  get "/check", to: "home#check"
  post "verify_otp", to: "sessions#verify_otp"

  resources :passwords, only: [ :create, :edit, :update ] do
    member do
      get :reset
    end
  end

  resources :two_factor_auth, only: [] do
    collection do
      post :setup
      post :verify
      post :disable
      post :recover_otp
    end
  end

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "*path", to: "home#index", constraints: ->(req) { req.path !~ /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/ }
  root "home#index"
end
