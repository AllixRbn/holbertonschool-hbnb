#!/usr/bin/python3
"""
Module to run the HBnB application
"""


from app import create_app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
