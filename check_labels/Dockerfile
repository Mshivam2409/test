FROM python:3.11-bullseye

COPY requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
COPY action.py /action.py

CMD [ "python3.11" , "/action.py" ]