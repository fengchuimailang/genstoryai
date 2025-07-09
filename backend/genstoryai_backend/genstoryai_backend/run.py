import uvicorn

def main():
    """Entry point for the application script"""
    uvicorn.run(
        "genstoryai_backend.main:app",
        host="0.0.0.0",
        port=80,
        reload=True
    )

if __name__ == "__main__":
    main()