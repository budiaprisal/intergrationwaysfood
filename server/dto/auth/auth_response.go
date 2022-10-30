package authdto

type LoginResponse struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	FullName string `json:"fullName"`
	Role     string `json:"role"`
	Token    string `json:"token"`
}

type CheckAuthResponse struct {
	ID       int    `json:"id"`
	Fullname string `json:"fullname"`
	Email    string `json:"email"`
	Image    string `json:"image"`
	Gender   string `json:"gender"`
	Phone    string `json:"phone"`
	Role     string `json:"role"`
	Location string `json:"location"`
	Token    string `json:"token"`
}
