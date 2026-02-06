echo "Building Docker images in Minikube..."
docker build -t api-gateway:latest -f api-gateway/Dockerfile .
docker build -t auth-service:latest -f auth-service/Dockerfile .
docker build -t user-service:latest -f user-service/Dockerfile .
docker build -t order-service:latest -f order-service/Dockerfile .
docker build -t payment-service:latest -f payment-service/Dockerfile .
echo "Images built successfully!"
