# **E-learning Platform RESTful API**

![GitHub](https://img.shields.io/badge/License-MIT-blue)
![GitHub](https://img.shields.io/badge/Node.js-v16.x-green)
![GitHub](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![GitHub](https://img.shields.io/badge/Deployed-Render-blueviolet)

A RESTful API for managing online courses and students. This platform allows instructors to create, update, and delete courses, upload course media, and analyze student engagement, while students can enroll in courses and manage their enrollments.

---

## **Features**
- User authentication (Register, Login) with JWT.
- Role-based access control (Instructor, Student).
- CRUD operations for courses.
- Student enrollment in courses.
- Course media upload via Cloudinary.
- Analytics endpoint for instructors.
- MongoDB Atlas for database management.
- Deployed on Render.com.

---

## **Technologies Used**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JSON Web Tokens (JWT)
- **Media Upload**: Cloudinary
- **Deployment**: Render.com
- **API Documentation**: Postman

---

## **API Endpoints**

### **User Routes**
| **Endpoint**               | **Method** | **Description**                     | **Access**       |
|----------------------------|------------|-------------------------------------|------------------|
| `/api/users/register`      | POST       | Register a new user                 | Public           |
| `/api/users/login`         | POST       | Login and get JWT token             | Public           |

### **Course Routes**
| **Endpoint**               | **Method** | **Description**                     | **Access**       |
| `/api/courses/create`      | POST       | Create a new course                 | Instructor       |
| `/api/courses/update/:id`  | PUT        | Update a course by ID               | Instructor       |
| `/api/courses/delete/:id`  | DELETE     | Delete a course by ID               | Instructor       |
| `/api/courses/enroll/:id`  | POST       | Enroll in a course                  | Student          |
| `/api/courses/upload`      | POST       | Upload course media                 | Instructor       |
| `/api/courses/analytics`   | GET        | Get course enrollment analytics     | Instructor       |

---

## **API Documentation**
The API is documented using Postman. You can access the Postman collection using this link:

[Postman Collection Link](https://www.postman.com/aliencampz/scribeteam/collection/wmlo3ea/thescribe)

---

## **Sample Requests**

### **Create a Course**
```bash
POST /api/courses/create
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Introduction to Node.js",
  "instructor": "John Doe",
  "duration": 10,
  "price": 49.99
}
```

### **Upload Course Media**
```bash
POST /api/courses/upload
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

{
  "file": "<path-to-your-file>"
}
```

### **Get Course Analytics**
```bash
GET /api/courses/analytics
Authorization: Bearer <your-jwt-token>
```

---

## **Author**
- Tempah
- GitHub: [tempahh](https://github.com/tempahh)
- Email: plance991@gmail.com

---

## **Acknowledgments**
- MongoDB Atlas for database hosting.
- Render.com for deployment.
- Postman for API documentation.
- Cloudinary for media upload functionality.

---

### **How to Use the Postman Collection Link**
1. Click the link above.
2. It will redirect you to Postman, where you can fork the collection into your workspace.
3. Use the collection to test the API endpoints.

---

