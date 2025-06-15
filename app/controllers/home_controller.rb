class HomeController < ApplicationController
  allow_unauthenticated_access only: %i[ index ]
  def index
    render layout: "home/index", html: ""
  end

  def check
    return render json: { message: "User authenticated", user: Current.user }, status: 200 if Current.user
    render json: { message: "User not authenticated" }, status: 401
  end
end
