FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Create a simple placeholder page
RUN echo '<html><head><title>Frontend Placeholder</title></head><body><h1>Frontend Placeholder</h1><p>The frontend application will be implemented here.</p></body></html>' > index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
