# Sample Docker container for testing
FROM ubuntu:22.04

# Install basic tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    vim \
    git \
    python3 \
    python3-pip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Create a sample file
RUN echo "Welcome to Docker Terminal!" > welcome.txt

# Keep container running
CMD ["tail", "-f", "/dev/null"]