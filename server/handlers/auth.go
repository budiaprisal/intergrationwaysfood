package handlers

import (
	"encoding/json"
	"fmt"
	authdto "foodways/dto/auth"
	dto "foodways/dto/result"
	usersdto "foodways/dto/users"
	"foodways/models"
	"foodways/pkg/bcrypt"
	jwtToken "foodways/pkg/jwt"
	"foodways/repositories"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
)

type handlerAuth struct {
	AuthRepository repositories.AuthReponsitory
}

func HandlerAuth(AuthRepository repositories.AuthReponsitory) *handlerAuth {
	return &handlerAuth{AuthRepository}
}

func (h *handlerAuth) Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	request := new(usersdto.CreateUserRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Status: "Failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Status: "Failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	password, err := bcrypt.HashingPassword(request.Password)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Status: "Failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
	}

	user := models.User{
		FullName: request.Fullname,
		Email:    request.Email,
		Password: password,
		Phone:    request.Phone,
		Gender:   request.Gender,
		Role:     request.Role,
	}

	data, _ := h.AuthRepository.Register(user)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Status: "Success", Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerAuth) Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	request := new(authdto.LoginRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Status: "Failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	user := models.User{
		Email:    request.Email,
		Password: request.Password,
	}

	user, err := h.AuthRepository.Login(user.Email)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Status: "Failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	isValid := bcrypt.CheckPassword(request.Password, user.Password)
	if !isValid {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Status: "Failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	generateToken := jwt.MapClaims{}
	generateToken["id"] = user.ID
	generateToken["email"] = user.Email
	generateToken["exp"] = time.Now().Add(time.Hour * 4).Unix()

	token, err := jwtToken.GenerateToken(&generateToken)
	if err != nil {
		fmt.Println("Unauthorize")
		return
	}

	AuthResponse := authdto.LoginResponse{
		FullName: user.FullName,
		Email:    user.Email,
		Password: user.Password,
		Role:     user.Role,
		Token:    token,
	}

	w.Header().Set("Content-Type", "application/json")
	response := dto.SuccessResult{Status: "Success", Data: AuthResponse}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerAuth) CheckAuth(w http.ResponseWriter, r *http.Request) {
	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	user, err := h.AuthRepository.GetUserAuth(userId)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Status: "Error", Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	generateToken := jwt.MapClaims{}
	generateToken["id"] = user.ID
	generateToken["email"] = user.Email
	generateToken["exp"] = time.Now().Add(time.Hour * 4).Unix()

	token, err := jwtToken.GenerateToken(&generateToken)

	if err != nil {
		fmt.Println("Unauthorize")
		return
	}

	response_auth := authdto.CheckAuthResponse{
		ID:       user.ID,
		Fullname: user.FullName,
		Email:    user.Email,
		Image:    user.Image,
		Gender:   user.Gender,
		Phone:    user.Phone,
		Role:     user.Role,
		Location: user.Location,
		Token:    token,
	}

	w.Header().Set("Content-Type", "application/json")
	response := dto.SuccessResult{Status: "Success", Data: response_auth}
	json.NewEncoder(w).Encode(response)
}
