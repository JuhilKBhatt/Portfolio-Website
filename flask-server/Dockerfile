FROM python:3.11-slim

# Create a non-root user for security
RUN useradd -m appuser

WORKDIR /app

# Install dependencies first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application and change ownership to the non-root user
COPY --chown=appuser:appuser . .

# Switch to the non-root user
USER appuser

# Expose port and run gunicorn
EXPOSE 5001
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5001"]
