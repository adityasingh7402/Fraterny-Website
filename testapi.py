from gzip import READ
from fastapi import FastAPI, Request
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, HTMLResponse
from datetime import datetime
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field, EmailStr
import httpx
from typing import Optional, Dict, Any
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
import smtplib
#from __future__ import print_function
import os.path
import time
# from fastapi_utilities import repeat_every
from fastapi_utils.tasks import repeat_every
import base64
import pickle
from paypalserversdk.http.auth.o_auth_2 import ClientCredentialsAuthCredentials
from paypalserversdk.logging.configuration.api_logging_configuration import (
    LoggingConfiguration,
    RequestLoggingConfiguration,
    ResponseLoggingConfiguration,
)
from paypalserversdk.paypal_serversdk_client import PaypalServersdkClient
from paypalserversdk.controllers.orders_controller import OrdersController
from paypalserversdk.controllers.payments_controller import PaymentsController
from paypalcheckoutsdk.core import LiveEnvironment, PayPalHttpClient
from paypalserversdk.models.amount_breakdown import AmountBreakdown
from paypalserversdk.models.amount_with_breakdown import AmountWithBreakdown
from paypalserversdk.models.checkout_payment_intent import CheckoutPaymentIntent
from paypalserversdk.models.order_request import OrderRequest
from paypalserversdk.models.capture_request import CaptureRequest
from paypalserversdk.models.money import Money
from paypalserversdk.models.shipping_details import ShippingDetails
from paypalserversdk.models.shipping_option import ShippingOption
from paypalserversdk.models.shipping_type import ShippingType
from paypalserversdk.models.purchase_unit_request import PurchaseUnitRequest
from paypalserversdk.models.payment_source import PaymentSource
from paypalserversdk.models.card_request import CardRequest
from paypalserversdk.models.card_attributes import CardAttributes
from paypalserversdk.models.card_verification import CardVerification
from paypalserversdk.models.orders_card_verification_method import OrdersCardVerificationMethod
from paypalserversdk.models.item import Item
from paypalserversdk.models.item_category import ItemCategory
from paypalserversdk.models.payment_source import PaymentSource
from paypalserversdk.models.paypal_wallet import PaypalWallet
from paypalserversdk.models.paypal_wallet_experience_context import (
    PaypalWalletExperienceContext,
)
from paypalserversdk.models.shipping_preference import ShippingPreference
from paypalserversdk.models.paypal_experience_landing_page import (
    PaypalExperienceLandingPage,
)
from paypalserversdk.models.paypal_experience_user_action import (
    PaypalExperienceUserAction,
)
from paypalserversdk.exceptions.error_exception import ErrorException
from paypalserversdk.api_helper import ApiHelper
# from google.auth.transport.requests import Request
# from email.mime.text import MIMEText
# from google.oauth2.credentials import Credentials
# from google_auth_oauthlib.flow import InstalledAppFlow
# from googleapiclient.discovery import build
import uuid
from datetime import datetime, timedelta
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
# from utils import verify_razorpay_signature, generate_order_receipt
from fastapi.middleware.cors import CORSMiddleware
import hmac
import hashlib
from agent import main
import logging
from multiagent import execute
from pydantic import BaseModel
import json
import tempfile, subprocess
import razorpay
from jinja2 import Template
import datetime
import os 
from supabase import create_client, Client
import supabase
from dotenv import load_dotenv
import logging
import asyncio
import psycopg2
load_dotenv()

app = FastAPI()

# Add CORS middleware to allow frontend to communicate with backend
# origins = [
#     "http://localhost:8080",
#     "https://www.fraterny.in",
#     "https://www.fraterny.com",
#  ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # In production, specify your frontend domain
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#     allow_headers=["*"],
# )


class queryrequest(BaseModel):
    query: dict

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")
logging.info(f"User of db {USER} {PASSWORD} {HOST}")
API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")
base_url = os.getenv("base_url")

# def supabase_connection():
#     try:
#         connection = psycopg2.connect(
#         user=USER,
#         password=PASSWORD,
#         host=HOST,
#         port=PORT,
#         dbname=DBNAME
#         )
#         print(f"Connection succesufully")
#         return connection
#     except Exception as e:
#         return f"Faile due to {e}"

# @app.middleware("http")
# async def cors_debug_middleware(request: Request, call_next):
#     origin = request.headers.get("origin")
#     logging.info(f"Request from origin: {origin}")
#     response = await call_next(request) 
#     logging.info(f"CORS headers in response: {response.headers}")
    
    # REMOVED these lines that were causing duplicate headers:
    # if origin and origin in origins:
    #     response.headers["Access-Control-Allow-Origin"] = origin
    #     response.headers["Access-Control-Allow-Credentials"] = "true"
    
    # return response

def fetch():
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = supabase_client.table("summary_generation").select("*")
        return response
    except Exception as e:
        return f"Failed to fetch data due to {e}"

def data_insert(query:dict,table:str):
    try:
        if table=="user_data":
            supabase_client: Client = create_client(API_URL, API_KEY)
            response = (
            supabase_client.from_("user_data")
            .insert(
                [
                query
                ]
            ).execute())
        elif table=="login_activity":
            supabase_client: Client = create_client(API_URL, API_KEY)
            response = (
            supabase_client.from_("login_activity")
            .insert(
                [
                query
                ]
            ).execute())
        elif table=="summary_generation":
            supabase_client: Client = create_client(API_URL, API_KEY)
            response = (
            supabase_client.from_("summary_generation")
            .insert(
                [
                query
                ]
            ).execute())
        elif table=="free_feedback":
            supabase_client: Client = create_client(API_URL,API_KEY)
            response = (
            supabase_client.from_("free_feedback")
            .insert(
                [
                query
                ]
            ).execute())
        elif table=="transaction_details":
            supabase_client: Client = create_client(API_URL,API_KEY)
            response = (
                supabase_client.from_("transaction_details").insert(
                    [
                        query
                    ]
                ).execute()
            )
        elif table=="paid_feedback":
            supabase_client: Client = create_client(API_URL,API_KEY)
            response = (
                supabase_client.from_("paid_feedback").insert(
                    [
                        query
                    ]
                ).execute()
            )       


        
        return f"Succesfully added"
    except Exception as e:
        return f"Failed due to {query} {e}"

def update_table(table:str,user_id:str,test_id:str,query:dict):
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = (supabase_client.from_(table).update([query]).eq("user_id", user_id).execute())
        #print(f"Update table response {response}")
        return f"Sucessfully Updated the Table"
    except Exception as e:
        return f"Failed to update data due to {e}"
    

def update_feedback(table:str,test_id:str,query:str):
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = supabase_client.from_(table).update([query]).eq("testid", test_id).execute()
        #print(f"Update table response {response}")
        return f"Sucessfully Updated the Table"
    except Exception as e:
        return f"Failed to update data due to {e}"   

def update_table_payment(user_id:str,table:str,test_id:str,query:dict):
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = (supabase_client.from_(table).update([query]).eq("testid",test_id).execute())
        #print(f"Update table response {response}")
        return f"Sucessfully Updated the Table"
    except Exception as e:
        return f"Failed to update data due to {e}"

def update_table_sum(table:str,test_id:str,query:dict):
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = (supabase_client.from_(table).update([query]).eq("testid",test_id).execute())
        #print(f"Update table response {response}")
        return f"Sucessfully Updated the Table"
    except Exception as e:
        return f"Failed to update data due to {e}"



def update_user_table(table:str,user_id:str,query:dict):
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = (supabase_client.from_(table).update([query]).eq("user_id", user_id).execute())
        #print(f"Update table response {response}")
        return f"Sucessfully Updated the Table"
    except Exception as e:
        return f"Failed to update data due to {e}"


# def update_feedback(table:str,user_id:str,test_id:str,query:dict):
#     try:
#         supabase_client: Client = create_client(API_URL, API_KEY)
#         response = (supabase_client.from_(table).update([query]).eq("user_id", user_id).execute())
#         print(f"Update table response {response}")
#         return f"Sucessfully Updated the Table"
#     except Exception as e:
#         return f"Failed to update data due to {e}"


def transaction_fetch(user_id:str):
    try:        
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = supabase_client.table("transaction_details").delete().eq("user_id", user_id).execute()
        return response 
    except Exception as e:
        return f"Failed to remove duel to {e}"    


def remove_row(user_id:str):
    try:        
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = supabase_client.table("user_data").delete().eq("user_id", user_id).execute()
        return response 
    except Exception as e:
        return f"Failed to remove duel to {e}"

    

def user_fetch(user_id):
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = supabase_client.table("user_data").select("*").eq("user_id", user_id).execute()
        print(f"Here is response in user fetech by using user id {user_id} {response}")
        if response.data and response.data[0]['user_id'] == user_id:
            logging.info(f"In user_fetch, user found: {response.data}")
            return {"status": "Found","data":response.data}
        else:
            logging.info(f"In user_fetch, user not found: {response.data}")
            return {"status": "Not"}
            
    except Exception as e:
        return {"status": "Failed", "error": str(e)}


def summ_fetch(testid:str):
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = supabase_client.table("user_data").select("*").eq("user_id", testid).execute()
        print(f"Here is response in user fetech by using user id {testid} {response}")
        if response.data and response.data[0]['testid'] == testid:
            logging.info(f"In user_fetch, user found: {response.data}")
            return {"status": "Found","data":response.data}
        else:
            logging.info(f"In user_fetch, user not found: {response.data}")
            return {"status": "Not"}
            
    except Exception as e:
        return {"status": "Failed", "error": str(e)}


def fetch(testid):
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        testid = testid
        response = supabase_client.table("summary_generation").select("*").eq("testid",testid).execute()
        if not response.data:
            return {"status":"Not_Found"}
        else:
            return {"status":"Found","result":response.data}

    except Exception as e:
        return f"Failed due to {e}"

def fetch_summary(user_id:str): # fetch with user id of summary genration
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = supabase_client.table("summary_generation").select("*").eq("user_id",user_id).execute()
        if not response.data:
            return {"status":"Not_Found"}
        else:
            return {"status":"Found","result":response.data}

    except Exception as e:
        return f"Failed due to {e}"

## save the each question answer of user in summary_question_answer table of db
def quest_an_saved(query:str):
    try:
        supabase_client: Client = create_client(API_URL,API_KEY)
        response = (
                supabase_client.from_("summary_question_answer").insert([
                        query
                    ]
                ).execute()
            )
        return f"Sucessfully Inserted the quest answer in db"
    except Exception as e:
        return f"Failed to insert the quest answer in db due to {e}"



@app.get("/api/status/{testid}")  
async def agent_status(testid: str):
    try:
        result = fetch(testid=testid)
        #print(f"here is result {result}")
        result = result['result']
        # print(f"here is status {type(result[0]['summary_response'])}")

        if result[0]['status']=="Complete":
            return {"status":"ready","testid":testid,"nessage":"Result Avaliable"}  
        elif result[0]['status']=="Failed":
            return {"status":"error","testid":testid,"message":"Failed to Analyse"}
        elif result[0]['status']=="Data Recieved & Extracted":
            return {"status":"processing","testid":testid,"message":"Analysis in Progress"}
        elif result[0]['status']=="Agent Started":
            return {"status":"processing","testid":testid,"message":"Agent just Start in Progress"}
        elif result[0]['status']=="Agent Completed":
            return {"status":"processing","testid":testid,"message":"Agent Complete in Progress"}
        else:
            return {"status":"error","testid":testid,"message":"Failed to Analyse"}
    except Exception as e:
        return {"status":"error","testid":testid,"message":f"Failed to Analyse due to {e}"}
        

    

@app.post("/api/agent")
async def summary_agent(request:Request,  background_tasks: BackgroundTasks):
    try:
        print(f"In summary agent")
        session_id = []     # Store the session to prevent from double requests
        query_data = await request.json()
        if query_data['assessment_metadata']['session_id'] in session_id:
            print(f"Sorry This request not be exectued ")
        else:
            print(f"hereis query_data type {type(query_data)}")
            testid = query_data['user_data']['testid']
            print(f"her eis test id {testid}")
            
            # Store IP and device fingerprint if provided (for fallback recovery)
            if 'assessment_metadata' in query_data and 'device_identifier' in query_data['assessment_metadata']:
                device_id = query_data['assessment_metadata'].get('device_identifier')
                if device_id and device_id.get('ip') and device_id.get('deviceHash'):
                    # Store in database for recovery later
                    print(f"Storing device identifier - IP: {device_id['ip']}, Hash: {device_id['deviceHash']}")
            
            background_tasks.add_task(agent, query_data)
            return {"status":"Submitted",testid:testid,"message":"Succefully goes for Analysing"}
    except Exception as e:
        return {"status":"error","message":"Submission Failed - Invalid Data"}



 

import ast

def agent(query_data :json):
    #await asyncio.sleep(3)  # Sleep for 3 seconds only 
    print(f"------- Starting -------------")
    #query_data = 
    print(f"Type in agent of query data {type(query_data)}")
    total_time_taken = 0
    user_response = ""
    #logging.info(f"Here is the data i get {query_data}")

    # add here data insert to know data is retrieve from json 
    

    q_time =[]
    for i in range(len(query_data['response'])):
        # if i==2:
        #     user_response += f"{query_data['response'][i]['question_text']}\n I'm between{query_data['response'][i]['answer']} years old.  {query_data['response'][i]['metadata']['tags']}\n"
        # else:
        if i<2:
            if type(query_data['response'][i]['answer']) == str:
                print(f"Inside str")
                query_data['response'][i]['answer'] = query_data['response'][i]['answer'].replace('false', 'False').replace('true', 'True')
                print(f"After replacing {query_data['response'][i]['answer']}")
                query_data['response'][i]['answer'] =  ast.literal_eval(query_data['response'][i]['answer'])
                
                print(f"Output is {type(query_data['response'][i]['answer'])}")
                if i ==0:
                    if query_data['response'][i]['answer']['isAnonymous']==False:
                        print(f"Inside name ")
                        user_response += f"Question: {query_data['response'][i]['question_text']}\nAnswer {query_data['response'][i]['answer']['name']}   {query_data['response'][i]['metadata']['tags']}\n"
                    else:
                        print(f"inside else mame")
                        user_response += f"Question: {query_data['response'][i]['question_text']}\nAnswer: User is Anonymous {query_data['response'][i]['metadata']['tags']}\n"
                else:
                    if query_data['response'][i]['answer']['isAnonymous']==False:
                        print(f"Inside email if")
                        user_response += f"Question: {query_data['response'][i]['question_text']}\n Answer: {query_data['response'][i]['answer']['email']}   {query_data['response'][i]['metadata']['tags']}\n"
                    else:
                        print(f"Inside email else")
                        user_response += f"Question: {query_data['response'][i]['question_text']}\n Answer: User is Anonymous {query_data['response'][i]['metadata']['tags']}\n"

        elif i==4:
            if type(query_data['response'][i]['answer']) == str:
                query_data['response'][i]['answer'] = query_data['response'][i]['answer'].replace('false', 'False').replace('true', 'True')
                query_data['response'][i]['answer'] =  ast.literal_eval(query_data['response'][i]['answer'])
                if query_data['response'][i]['answer']['isAnonymous']==False:
                    user_response += f" Question: {query_data['response'][i]['question_text']}\n  Answer: {query_data['response'][i]['answer']['details']}  {query_data['response'][i]['metadata']['tags']}\n"
                else:
                    user_response += f" Question: {query_data['response'][i]['question_text']}\n Answer: {query_data['response'][i]['answer']['details']}  {query_data['response'][i]['metadata']['tags']}\n"
        
        else:
            user_response += f"Question: {query_data['response'][i]['question_text']}\n Answer: {query_data['response'][i]['answer']}   {query_data['response'][i]['metadata']['tags']}\n"
        if i == 21:
            continue
        elif query_data['response'][i]['metadata'].get('time_taken') is not None:
            time_str = query_data['response'][i]['metadata']['time_taken']
        else:
            time_str = None
        if not time_str or "not" in time_str:
            q_time.append(4)
        else:
            logging.info(f"Time taken {query_data['response'][i]['metadata']['time_taken']}")
            time_taken = float(query_data['response'][i]['metadata']['time_taken'].lower().replace("s", ""))
            q_time.append(time_taken) # each question time taken
            
            total_time_taken += time_taken

    print(f"Here is user response ---------- \n {user_response} \n")

    

    print(f"Length of q_time {len(q_time)} {q_time}")
    if query_data['response'][0]['answer']['isAnonymous']==False:
        user_name = query_data['response'][0]['answer']['name'] # user data
    else:
        user_name = "Anonymous"

    if query_data['response'][1]['answer']['isAnonymous']==False:
        email = query_data['response'][1]['answer']['email'] # user data
    else:
        email = "Anonymous"

    if query_data['response'][4]['answer']['isAnonymous']==False:
        city = query_data['response'][4]['answer']['selectedCity'] # user data
    else:
        city = "Anonymous"

  
    # email = query_data['response'][1]['answer'][] # user data
    dob = query_data['response'][2]['answer'] # user data
    gender = query_data['response'][3]['answer']  # this will save in summary generation
    mobile_no = query_data['user_data']['mobile no']
    user_id = query_data['user_data']['user_id']

    print(f"Here is name of user {user_name}")
    print(f"Here is user id {user_id}")

    
    #fake_data = user_fetch(user_id=query_data['user_data']['user_id'])    
    # if fake_data.get("status")=="Not":
    #     query = {
    #     "testid": query_data['user_data']['testid'],
    #     "user_id": user_id
    # }
    #     print(f"-------- Iniside fake data if -------- ")
    #     print(data_insert(query=query,table="summary_generation"))


    # print(user_response)
    # result = main(query)
    
    question_query= user_response
    
    # user_data
    ann = False
    # print(f"here is ann beofre {ann}")
    if user_id == 'anonymous':
        ann = True
        print(f"Here is ann is TRUE {ann}")
        user_id = str(uuid.uuid4())
        print(f"Here is user id if user ann {user_id}")
    # print(f"Heer is ann {ann}")
     
    if "preferred" in dob:
        dob = "1999-01-01"
    if "preferred" in mobile_no:
        mobile_no = "999999999"
    query = {
        "user_id": user_id,
        "user_name": user_name,
        "email": email,
        "city":city,
        "dob": dob,
        "gender": gender,
        "mobile_number": mobile_no,
        "last_used": query_data['assessment_metadata']['completion_time'],
        "is_anonymous": True if ann == True else False
    }
    
    # if ann == True:
    #     print(data_insert(query=query, table="user_data"))
    # else:
    #     user_info = user_fetch(user_id=user_id)
    #     if user_info.get("status") != "Found":
            
    #         print(data_insert(query=query, table="user_data"))
    #     else:
    #         logging.info("User data already exists in server")

    if ann==True:
        print(f"Here inside ananoy user data inserting")
        print(data_insert(query=query, table="user_data"))
    else:
        user_info = user_fetch(user_id=user_id)
        if user_info.get("status") != "Found":
            
            print(data_insert(query=query, table="user_data"))
        else:
            logging.info("User data already exists in server")

    
    # Extract device identifier if provided
    device_ip = None
    device_hash = None
    if 'assessment_metadata' in query_data and 'device_identifier' in query_data['assessment_metadata']:
        device_id = query_data['assessment_metadata'].get('device_identifier')
        if device_id:
            device_ip = device_id.get('ip')
            device_hash = device_id.get('deviceHash')
    
    query = {
        "user_id":user_id,
        "testid":query_data['user_data']['testid'],
        "status":"Data Recieved & Extracted",
         "question_answer":user_response,
         "agent_start_time": dt.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3] + "+00",
         "session_id":query_data['assessment_metadata']['session_id'],
         "ip_address": device_ip,  # Store IP for recovery
         "device_fingerprint": device_hash  # Store device hash for recovery
    }
    print(data_insert(query=query,table="summary_generation")) 
    url = f"https://www.fraterny.in/quest-result/result/{user_id}/{query_data['assessment_metadata']['session_id']}/{query_data['user_data']['testid']}"
    query = {
        "user_id":user_id,
        "testid": query_data['user_data']['testid'],
        "name": user_name,
        "email": email,
        "age":  query_data['response'][2]['answer'],
        "gender":  query_data['response'][3]['answer'],
        "lived_most_in_city":  query_data['response'][4]['answer']['details'],
        "city": city,
        "grow_up_with": query_data['response'][5]['answer'] ,
        "childhood_different":  query_data['response'][6]['answer'],
        "family_fight":  query_data['response'][7]['answer'],
        "highest_priority_goal": query_data['response'][8]['answer'] ,
        "what_matters":  query_data['response'][9]['answer'],
        "magically_3_things":  query_data['response'][10]['answer'],
        "understand_better_than": query_data['response'][11]['answer'] ,
        "best_in_the_world":  query_data['response'][12]['answer'],
        "inspires_you":  query_data['response'][13]['answer'],
        "bad_habbit_other_say":  query_data['response'][14]['answer'],
        "you_do_regularly":  query_data['response'][15]['answer'],
        "emotion_find_hard_to_show":  query_data['response'][16]['answer'],
        "you_proou_yourself": query_data['response'][17]['answer'] ,
        "close_friends_describe_you":  query_data['response'][18]['answer'],
        "describe_personality": query_data['response'][19]['answer'] ,
        "you_wish_people_understand":  query_data['response'][20]['answer']
    }
    print(f"------ Here is query of saveing is qu an db ------- \n {query} \n\n")
    print(quest_an_saved(query=query))
    data = [user_name,email,city,dob,mobile_no,ann,user_id,query_data['user_data']['testid'],query_data['assessment_metadata']['device_info']['type'],query_data['assessment_metadata']['device_info']['browser'],query_data['assessment_metadata']['device_info']['operating_system'],query_data['assessment_metadata']['start_time'],query_data['assessment_metadata']['completion_time'],q_time[0],q_time[1],q_time[2],q_time[3],q_time[4],q_time[5],q_time[6],q_time[7],q_time[8],q_time[9],q_time[10],q_time[11],q_time[12],q_time[13],q_time[14],q_time[15],q_time[16],q_time[17],q_time[18],q_time[19],q_time[20],"None","None",url,gender,"None","Generating","None"]
    print(f"Appending the row here ")
    print(user_datasheet(data=data))   # Insert the row in user data sheet first time 
    
    # Insert the row in summary generation table

    start = time.perf_counter()
    #agent_start_time = dt.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3] + "+00"
    result = main(user=user_response,testid=query_data['user_data']['testid'], user_id=user_id)
    query = {
        "status":"Passing to Json"
    }
    update_table_sum(table="summary_generation",test_id=query_data['user_data']['testid'],query=query)
    if result['status']==200:
        result = result['message']
        end = time.perf_counter()
        agent_completion_time = dt.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3] + "+00"
        print(agent_completion_time)
        #print(agent_start_time)
        total_time_taken_by_agent= f"{end - start:.1f}"

        print(f"---- Here is total time taken by agent flow {total_time_taken_by_agent}")


        url = f"https://www.fraterny.in/quest-result/result/{user_id}/{query_data['assessment_metadata']['session_id']}/{query_data['user_data']['testid']}"
        logging.info("Before correcting the resposne format")
        if result is not None and isinstance(result, str) and result.startswith("'''json") and result.endswith("'''"):
            result = result[7:-3].strip()
            logging.info("Inside if of result json")
            try:
                parsed = json.loads(result)
                    # summary_geneartion
                query = {
                    "user_id":user_id,
                    "testid":query_data['user_data']['testid'],
                    "summary_response": result,
                   # "session_id": query_data['assessment_metadata']['session_id'],
                    "device_type":query_data['assessment_metadata']['device_info']['type'],
                    "device_browser":query_data['assessment_metadata']['device_info']['browser'],
                    "operating_system":query_data['assessment_metadata']['device_info']['operating_system'],
                    "starting_time": query_data['assessment_metadata']['start_time'],
                    "completion_time": query_data['assessment_metadata']['completion_time'],
                    "complete_duration": total_time_taken,
#"agent_start_time":agent_start_time,
                    "agent_completion_time": agent_completion_time,
                    "total_time_taken_by_agent": total_time_taken_by_agent,
                    "status": "Complete",
                    "url":url,
                    "q1_1":q_time[0],
                    "q1_2":q_time[1],
                    "q1_3":q_time[2],
                    "q1_4":q_time[3],
                    "q1_5": q_time[4],
                    "q2_1": q_time[5],
                    "q2_2": q_time[6],
                    "q2_3": q_time[7],
                    "q3_1": q_time[8],
                    "q3_2": q_time[9],
                    "q3_3": q_time[10],
                    "q3_4": q_time[11],
                    "q3_5": q_time[12],
                    "q3_6": q_time[13],
                    "q4_1": q_time[14],
                    "q4_2": q_time[15],
                    "q4_3": q_time[16],
                    "q4_4": q_time[17],
                    "q5_1": q_time[18],
                    "q5_2": q_time[19],
                    "q5_3": q_time[20],
                    "qualityscore":result['qualityscore']         
                }
                #logging.info(f"query of summary {query}")
                try:
                    final = update_table_sum(table="summary_generation",test_id=query_data['user_data']['testid'],query=query)
                    data = [user_name,email,city,dob,mobile_no,ann,user_id,query_data['user_data']['testid'],query_data['assessment_metadata']['device_info']['type'],query_data['assessment_metadata']['device_info']['browser'],query_data['assessment_metadata']['device_info']['operating_system'],query_data['assessment_metadata']['start_time'],query_data['assessment_metadata']['completion_time'],q_time[0],q_time[1],q_time[2],q_time[3],q_time[4],q_time[5],q_time[6],q_time[7],q_time[8],q_time[9],q_time[10],q_time[11],q_time[12],q_time[13],q_time[14],q_time[15],q_time[16],q_time[17],q_time[18],q_time[19],q_time[20],total_time_taken_by_agent,"None",url,gender,agent_completion_time,"Generated","None","",result['qualityscore'] ]
                    try:
                        flag = user_data_sheet_update(data=data,testid=query_data['user_data']['testid']) # Update the row in user data sheet
                        if flag['status']=="failed":
                            print(user_data_sheet_2update(data=data,testid=query_data['user_data']['testid']))
                        else:
                            print(f"Update the row sheet user data")
                    except Exception as e:
                        print(f"Failed due to {e}")
                        

                    print(final)
                    #final= data_insert(query=query,table="summary_generation")
                    #logging.info(f"SUcess fully added or not in summar {final}")
                except Exception as e:
                    logging.info(f"failed to add data in summar")
                                # result = {
                #     "session_id": query_data['assessment_metadata']['session_id'],
                #     "user_id": user_id,
                #     "completion_date": query_data['assessment_metadata']['completion_time'],
                #     "server_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                #     "results":result
                # }
                return {"context":{"status_code":200,"message":"Sucessfully Generated the Code"}}
            except Exception as e:
                return {"response":f"Failed due to if {e}"}
        else:
            logging.info(f"inside else")
            try:
                print(f"Inside try")
                # try:
                #     result = json.loads(result)
                # except Exception as e:
                #     print(f"failed due to json load is {e}")
                #logging.info(f"Insid elese try {result}")
                
                query = {
                    "user_id":user_id,
                    "testid":query_data['user_data']['testid'],
                    "summary_response": result,
                  #  "session_id": query_data['assessment_metadata']['session_id'],
                    "device_type":query_data['assessment_metadata']['device_info']['type'],
                    "device_browser":query_data['assessment_metadata']['device_info']['browser'],
                    "operating_system":query_data['assessment_metadata']['device_info']['operating_system'],
                    "starting_time": query_data['assessment_metadata']['start_time'],
                    "completion_time": query_data['assessment_metadata']['completion_time'],
                    "complete_duration": total_time_taken,
                   # "agent_start_time":agent_start_time,
                    "agent_completion_time": agent_completion_time,
                    "total_time_taken_by_agent":total_time_taken_by_agent ,
                    "status": "Complete",
                    "url":url,
                    "q1_1":q_time[0],
                    "q1_2":q_time[1],
                    "q1_3":q_time[2],
                    "q1_4":q_time[3],
                    "q1_5": q_time[4],
                    "q2_1": q_time[5],
                    "q2_2": q_time[6],
                    "q2_3": q_time[7],
                    "q3_1": q_time[8],
                    "q3_2": q_time[9],
                    "q3_3": q_time[10],
                    "q3_4": q_time[11],
                    "q3_5": q_time[12],
                    "q3_6": q_time[13],
                    "q4_1": q_time[14],
                    "q4_2": q_time[15],
                    "q4_3": q_time[16],
                    "q4_4": q_time[17],
                    "q5_1": q_time[18],
                    "q5_2": q_time[19],
                    "q5_3": q_time[20],
                    "qualityscore":result['qualityscore']                
                }
                #logging.info(f"query of summary {query}")
                try:
                    # final= data_insert(query=query,table="summary_generation")
                    final = update_table_sum(table="summary_generation",test_id=query_data['user_data']['testid'],query=query)
                    data = [user_name,email,city,dob,mobile_no,ann,user_id,query_data['user_data']['testid'],query_data['assessment_metadata']['device_info']['type'],query_data['assessment_metadata']['device_info']['browser'],query_data['assessment_metadata']['device_info']['operating_system'],query_data['assessment_metadata']['start_time'],query_data['assessment_metadata']['completion_time'],q_time[0],q_time[1],q_time[2],q_time[3],q_time[4],q_time[5],q_time[6],q_time[7],q_time[8],q_time[9],q_time[10],q_time[11],q_time[12],q_time[13],q_time[14],q_time[15],q_time[16],q_time[17],q_time[18],q_time[19],q_time[20],total_time_taken_by_agent,"None",url,gender,agent_completion_time,"Generated","None","",result['qualityscore']]
                    print(final)
                    
                    try:
                        flag = user_data_sheet_update(data=data,testid=query_data['user_data']['testid']) # Update the row in user data sheet
                        if flag['status']=="failed":
                            print(user_data_sheet_2update(data=data,testid=query_data['user_data']['testid']))
                        else:
                            print(f"Update the row sheet user data")
                    except Exception as e:
                        print(f"Failed due to {e}")
                    #print(final)

                    
                # logging.info(f"SUcess fully added or not in summar {final}")
                except Exception as e:
                    logging.info(f"failed to add data in summar")
                result = {
                    "session_id": query_data['assessment_metadata']['session_id'],
                    "user_id": user_id,
                    "completion_date": query_data['assessment_metadata']['completion_time'],
                    "server_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                    "results":result
                }
                
                # query = {
                #     "user_id":user_id,
                #     "total_summary_generation":total_summary_generation
                # }

                # print(data_insert(query=query, table="user_data"))

                query = {
                    "user_id": query_data['user_data']['user_id'],
                    "testid": query_data['user_data']['testid']
                }
                print(data_insert(query=query,table="free_feedback"))
                #logging.info(f"Final output {result}")
                return {"context":{"status":200,"message":"Sucessfully Generated the Code"}}

            except Exception as e:
                query = {
                    "summary_error": f"Failed due to {e}",
                    "status":"Failed"
                }
                update_table_sum(table="summary_generation",test_id=query_data['user_data']['testid'],query=query)
                return {"context":{"status":300,"message":f"Failed to Generate due to {e}"}}
    else:
        query = {
                    "summary_error": result['message'],
                    "status":"Failed"
                }
        update_table_sum(table="summary_generation",test_id=query_data['user_data']['testid'],query=query)
        return {"context":{"status":300,"message":f"Failed to Generate "}}
    

@app.post("/api/quest/recover")
async def recover_sessions(request: Request):
    """
    Recover user sessions using IP address and device fingerprint.
    This is a FALLBACK method when sessionId is not available in localStorage.
    """
    try:
        data = await request.json()
        ip_address = data.get('ip')
        device_hash = data.get('deviceHash')
        user_id = data.get('userId')  # Optional, if user is logged in
        time_limit = data.get('timeLimit', 30)  # NEW: Default to 30 minutes
        
        if not ip_address or not device_hash:
            return {
                "success": False,
                "sessions": [],
                "message": "IP address and device hash are required"
            }
        
        print(f"Recovery request - IP: {ip_address}, Hash: {device_hash}, UserID: {user_id}, TimeLimit: {time_limit}min")
        
        # NEW: Calculate time threshold for last N minutes
        from datetime import datetime, timedelta
        time_threshold = (datetime.now() - timedelta(minutes=time_limit)).isoformat()
        
        # Connect to database and find matching sessions
        supabase_client: Client = create_client(API_URL, API_KEY)
        
        # Query for sessions with matching IP and device fingerprint
        query = supabase_client.table("summary_generation").select(
            "session_id", "testid", "user_id", "completion_time", "complete_duration", "status", "agent_start_time"
        )
        
        # First try exact match (IP + device hash)
        query = query.eq("ip_address", ip_address).eq("device_fingerprint", device_hash)
        
        # If user_id provided, can also filter by it
        if user_id and user_id != 'anonymous':
            query = query.eq("user_id", user_id)
        
        # MODIFIED: Include both Complete and Agent Started statuses
        query = query.in_("status", ["Complete", "Agent Started"])
        
        # NEW: Filter by time threshold (last N minutes)
        query = query.gte("agent_start_time", time_threshold)
        
        # Order by most recent first
        query = query.order("agent_start_time", desc=True)  # Changed from completion_time to agent_start_time
        
        # Limit to last 10 sessions
        query = query.limit(10)
        
        response = query.execute()
        
        if response.data and len(response.data) > 0:
            # Format sessions for frontend
            sessions = []
            for session in response.data:
                # Calculate completion percentage based on status
                completion_percentage = 100 if session['status'] == 'Complete' else 50  # Agent Started = 50%
                
                sessions.append({
                    "session_id": session['session_id'],
                    "test_id": session['testid'],
                    "user_id": session['user_id'],
                    "completion_date": session.get('completion_time', session['agent_start_time']),
                    "completion_percentage": completion_percentage
                })
            
            print(f"Found {len(sessions)} sessions for device in last {time_limit} minutes")
            
            return {
                "success": True,
                "sessions": sessions
            }
        else:
            # MODIFIED: Update fallback query with same filters
            print("No exact match found, trying device fingerprint only...")
            
            fallback_query = supabase_client.table("summary_generation").select(
                "session_id", "testid", "user_id", "completion_time", "complete_duration", "status", "agent_start_time"
            ).eq("device_fingerprint", device_hash).in_("status", ["Complete", "Agent Started"]).gte("agent_start_time", time_threshold).order("agent_start_time", desc=True).limit(5)
            
            fallback_response = fallback_query.execute()
            
            if fallback_response.data and len(fallback_response.data) > 0:
                sessions = []
                for session in fallback_response.data:
                    completion_percentage = 100 if session['status'] == 'Complete' else 50
                    
                    sessions.append({
                        "session_id": session['session_id'],
                        "test_id": session['testid'],
                        "user_id": session['user_id'],
                        "completion_date": session.get('completion_time', session['agent_start_time']),
                        "completion_percentage": completion_percentage
                    })
                
                print(f"Found {len(sessions)} sessions using device fingerprint fallback in last {time_limit} minutes")
                
                return {
                    "success": True,
                    "sessions": sessions,
                    "message": "Found sessions from different network location"
                }
            else:
                return {
                    "success": False,
                    "sessions": [],
                    "message": f"No assessments found for this device in the last {time_limit} minutes"
                }
                
    except Exception as e:
        print(f"Error in recover_sessions: {e}")
        return {
            "success": False,
            "sessions": [],
            "message": f"Error recovering sessions: {str(e)}"
        }

@app.get("/api/report/{session_id}/{user_id}/{testid}")
async def report(session_id: str, user_id: str,testid:str)-> dict:
    logging.info(f"Inside feteching {session_id} {user_id}  {testid} in api report")    
    result = fetch(testid=testid)
    #logging.info(f"Here is the ftech report:  {result}")
    if result['status']=='Not_Found':
        return {"status":"Data Not Found in Server"}
    else:
        #print(f"Hre i sthe result {result}")
        result = result['result']  

        result_sum = result[0]['summary_response']
        #print(f"Here is result {result_sum}")
        if result_sum.startswith("```") and result_sum.endswith("```"):
            result_sum= result_sum[7:-3].strip()
        print(f"Her eis type in api reprot when fetching {type(result_sum)}")
        # result_sum = json.loads(result_sum)  # convert the data into json
        result = {
            "session_id": session_id,
            "user_id":user_id,
            "completion_date": result[0]['completion_time'],
            "results":result_sum,
            "payment_status":  result[0]['payment_status']

        }
        return result




# {sessionId,
#       testId,
#       like: reacted === "up" ? "yes" : "no",
#       dislike: reacted === "down" ? "yes" : "no", 
#       feedback,
#       sectionId: "emotional"
#     }
## Paid PDF 
@app.post("/api/quest/feedback")
async def feedback(request : Request):
    try:
        data = await request.json()
        print(f"Here is data {data}")
        section = data['sectionId']
        
        print(f"Here is sectionid {section}") 
        testid = data['testId']
        feedbackdatetime =  datetime.datetime.now(datetime.timezone.utc).isoformat()
        query = {
        "time": feedbackdatetime,
        section: data['feedback'],
            # f"{section}_react":data['reaction']
        }
        print(f"Here is query {query}")
        result = update_feedback(table="free_feedback",test_id=data['testId'],query=query)
        
        data = [feedbackdatetime]
       # print(feedback_sheet_update(data=data,testid=testid,col=45))  # date time
        print(f"Here is result {result}")

        # if data['sectionId']=="emotional":
        #     data = [data['feedback']]

        #     print(feedback_sheet_update(data=data,testid=testid,col=46))
            
        # elif data['sectionId']=="mind":
        #     data = [data['feedback']]
        #     print(feedback_sheet_update(data=data,testid=testid,col=48))
        # elif data['sectionId']=="findings":
        #     data = [data['feedback']]
        #     print(feedback_sheet_update(data=data,testid=testid,col=50))
        # elif data['sectionId']=="quotes":
        #     data = [data['feedback']]
        #     print(feedback_sheet_update(data=data,testid=testid,col=52))
        # elif data['sectionId']=="films":
        #     data = [data['feedback']]
        #     print(feedback_sheet_update(data=data,testid=testid,col=54)) 
        # elif data['sectionId']=="subjects":
        #     data = [data['feedback']]
        #     print(feedback_sheet_update(data=data,testid=testid,col=56))
        # elif data['sectionId']=="astrology":
        #     data = [data['feedback']]
        #     print(feedback_sheet_update(data=data,testid=testid,col=58))
        # elif data['sectionId']=="books":
        #     data = [data['feedback']]
        #     print(feedback_sheet_update(data=data,testid=testid,col=60))
        # elif data['sectionId']=="work":
        #     data = [data['feedback']]
        #     print(feedback_sheet_update(data=data,testid=testid,col=62))

        return f"Sucessfully added"
    except Exception as e:
        return f"Failed to add feedback due to {e}"


@app.post("/api/quest/like_feedback")
async def feedback(request : Request):
    try:
        data = await request.json()
        print(f"Here is data {data}")
        section = data['sectionId']
        testid = data['testId']
        print(f"Here is sectionid {section}") 
        query = {
            f"{section}_react":data['reaction']
        }
        print(f"Here is query {query}")
        result = update_feedback(table="free_feedback",test_id=data['testId'],query=query)
        feedbackdatetime =  datetime.datetime.now(datetime.timezone.utc).isoformat()
        data = [feedbackdatetime]
        print(feedback_sheet_update(data=data,testid=testid,col=45))
        if data['sectionId']=="emotional":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=47))
            
        elif data['sectionId']=="mind":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=49))
        elif data['sectionId']=="findings":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=51))
        elif data['sectionId']=="quotes":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=53))
        elif data['sectionId']=="films":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=55)) 
        elif data['sectionId']=="subjects":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=57))
        elif data['sectionId']=="astrology":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=59))
        elif data['sectionId']=="books":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=61))
        elif data['sectionId']=="work":
            data = [data['reaction']]
            print(feedback_sheet_update(data=data,testid=testid,col=63))

        print(f"Here is result {result}")
        return f"Sucessfully added"
    except Exception as e:
        return f"Failed to add feedback due to {e}"


    
@app.post("/quest-paid-feedback/")
async def paid_feedback(request : Request):
    data = await request.json()
    userid = data["userId"]
    sessionid = data["sessionId"]
    testid = data['testId']
    rating = data['rating']
    feedback = data['feedback']

    query = {
        "user_id": userid,
        "testid": testid,
        "sessionid": sessionid,
        "rating":rating,
        "feedback":feedback
    }

    result = data_insert(query=query,table="paid_feedback")
    if "Succesfully" in result:
        return {"status":200, "message":"Sucessfully Added"}
    else:
        return {"status":401,"message":f"Failed {result}"}


## Call the Multiagent system after payment verification
# @app.post("/api/quest/payment/")

# harsimran ye api bana dio
# https://api.fraterny.in/api/payment-history/${userId}
# id: string;
#      userId: string;
#      sessionId: string;
#      testId: string; list
#      amount: number;
#      IsIndia : True or False
#      paymentStatus: 'success' | 'failed' | 'pending';
#      paymentDate: string; 
#      paymentMethod?: string;
#      transactionId?: string;
#      razorpayOrderId?: string;
#      razorpayPaymentId?: string

razor_key = os.getenv("YOUR_KEY_ID")
razor_secret = os.getenv("YOUR_SECRET")


supabase: Client = create_client(API_URL, API_KEY)
@app.get("/api/payment-history/{userId}")
async def fetch_user_payment_summary(userId: str):
    # --- Step A: get all testids & session info for the user ---
    user_id = userId
    print(f"Here is user id {user_id}")
    summary_resp = (
        supabase.table("summary_generation")
        .select("user_id, session_id, testid")
        .eq("user_id", user_id)
        .execute()
    )
    summary_rows = summary_resp.data
   # print(summary_rows)
    # collect all testids
    test_ids = [row["testid"] for row in summary_rows]

    # --- Step B: fetch matching transactions
    tx_resp = (
        supabase
        .table("transaction_details")
        .select(
            "user_id, testid, total_paid, IsIndia, status, date, order_id, payment_id"
        ).eq("status","success").in_("testid", test_ids).execute()        # match on testid
        
    )
    tx_rows = tx_resp.data

    # --- Step C: merge summary + transaction data ---
    # create quick lookup by testid
    summary_lookup = {s["testid"]: s for s in summary_rows}

    merged = []
    for t in tx_rows:
        s = summary_lookup.get(t["testid"], {})
        merged.append({
            "userId": t["user_id"],
            "sessionId": s.get("session_id"),
            "testId": t["testid"],
            "amount": t.get("total_paid"),
            "IsIndia": t.get("IsIndia"),
            "paymentStatus": t.get("status"),
            "paymentDate": t.get("date"),
            # "paymentMethod": t.get("paymentMethod"),
            "razorpayOrderId": t.get("order_id"),
            "razorpayPaymentId": t.get("payment_id"),
        })
    print(f"here is merged {merged}")
    return merged



def paid_version(userid :str, testid :str):
# @app.post("/api/testing")
# async def paid_version(request : Request):
    # da = await request.json()
    # print(da)
    # userid = da['userid']
    # testid = da['testid']
    print("Inside the paid version ")
    print("------ PDF AGENT START ------")
    start = time.time()
    db_result_summary = fetch(testid=testid) # finding anonymous user id using test id
    user_id_serach = user_fetch(user_id=userid)  # finding anonymous user account if exit then replace db_result_summary user_id and remove the anonymous column
    session_id = db_result_summary['result'][0]['session_id']

    print(f"---- user id serach in user data table {user_id_serach}")
    if user_id_serach['status'] == "Found":
        
        query = {
            "user_id":userid
        }

        print(update_table_sum(test_id=testid,table="summary_generation",query=query))
    else:
        # user id not found in user_data so it's new user
        old_user_id = db_result_summary['result'][0]['user_id']
        print(f"SUmmary User id {old_user_id}")

        query = {
        "user_id": userid,
        "is_anonymous":"false"
    }
        print(update_user_table(table="user_data",user_id=old_user_id,query=query)) #udpate the user id with new user id given by frontend 
    pdf_attempt = db_result_summary['result'][0]['pdf_attempt']
    if pdf_attempt==0:
        pdf_attempt = 0
    elif pdf_attempt==3:
        print(update_table(user_id=userid,test_id=testid,query={"quest_error":"Maximum Attemps Reached out"},table="summary_generation"))
        return f"MAXIMUM ATTAMPS REACH OUT"
    elif pdf_attempt is None:
        pdf_attempt = 0
        pdf_attempt += 1
    user_data = user_fetch(user_id=userid)
    
    #print(f"db result summary {db_result_summary}")
    summary_response = db_result_summary['result'][0]['thought']   # Thought here 
    question_answer = db_result_summary['result'][0]['question_answer']
    name = user_data["data"][0]["user_name"]
    # if name == "I preferred not to response for this question":
    #     name ="NotFound"
    email = user_data["data"][0]["email"]
    total_paid_geneartion = user_data["data"][0]["total_paid_generation"]
    if total_paid_geneartion== 0:
        total_paid_geneartion += 1
        print(f"Here is total Paid geneation {total_paid_geneartion}")
    query = f"Here is Summary Response of User {summary_response} and here is answers of questions that user filled {question_answer}"
    agent_start_time = dt.now().strftime("%Y-%m-%d %H:%M:%S")
    query_summ = {
                "pdf_attempt": pdf_attempt,
                "quest_status":"Data Extracted",
                "paid_agent_start_time":agent_start_time
            }
    
    up_data = [agent_start_time]
   # paid_agent_cell_update(data=up_data,col=62,testid=testid)
    print(update_table_sum(test_id=testid,query=query_summ,table="summary_generation"))
    
    data = execute(query=query,person_name=name,user_id=userid,test_id=testid,session_id=session_id,agent_start_time=agent_start_time)
    
    up_data = [agent_start_time]
    #paid_agent_cell_update(data=up_data,col=63,testid=testid)
    # if type(data["future_output"]) is str:
    #     paid_version(userid=userid,testid=testid)
    # if type(data['future_output']) is str:
    #     paid_version(userid=userid,testid=testid)
    if data['status']== 200:
        
        #print(f"Here is data {data}")
        image_list = data['image_list'] 
        
        # if data['status']==300:
        #     data = execute(query=query,person_name=name)
        if " " in name:
            name = name.replace(" ","_")
        
        
        print(f"Here in paid version after darta")
        
        result = generatepdf(data,name,test_id=testid,agent_start_time=agent_start_time)
        #print(f"Here is result {result} in generate pdf")
        # if result['status']!=200:
        #     print(f"Here is proble in gerate pdf {result}")
        for i in image_list:
            #print(f"Here insid eimage deleteion {i}")
            if os.path.exists(i):
                os.remove(i)

        
        if result['status']==200:
            pdf_result =  {"status":200,"message":"Successfully Generated PDF File","file_path":result['compress_pdf']}
            print(f"Here is pdf result {pdf_result}")
            supabase : Client = create_client(API_URL, API_KEY)
            file_path = pdf_result['file_path']
            # date_time =  dt.now().strftime("%Y-%m-%d_%H-%M-%S")
            storage_path = f"Quest_{name}_{agent_start_time}.pdf"
            try:
                upload_response = supabase.storage.from_("questpaid").upload(
                storage_path,
                file_path,
                {"content-type": "application/pdf"}
            )
            except Exception as e:
                update_table(user_id=userid,test_id=testid,query={"quest_error":f"Failed to upload due to {e}"},table="user_data")
                upload_response = supabase.storage.from_("questpaid").upload(
                storage_path,
                file_path,
                {"content-type": "application/pdf"}
            )
                
            url = supabase.storage.from_('questpaid').get_public_url(storage_path)
            print(f"here is url {url}")
        
            # paid_agent_cell_update(data=up_data,col=66,testid=testid)
            # up_data = [url]
            
            end = time.time()
            agent_complete_time = dt.now().strftime("%Y-%m-%d %H:%M:%S")
            paid_geenartion_time = end - start
            

            #print(paid_agent_cell_update(data=paid_geenartion_time,col=27,testid=testid))
            data = [agent_start_time,agent_complete_time,"generated","None",url]
            
           # print(paid_agent_sheet_update(data=data,testid=testid))

            query_summ = {
                "quest_pdf":url,
                "paid_generation_time": dt.now().strftime("%Y-%m-%d %H:%M:%S"), #completion time
                "quest_status":"generated",
                "paid_agent_time":paid_geenartion_time, # total time time taken
                "paid_agent_complete_time":agent_complete_time 
            }
            print(update_table_sum(test_id=testid,query=query_summ,table="summary_generation"))

            user_query = {
                "total_paid_generation":total_paid_geneartion
            }
            update_table(user_id=userid,test_id=testid,query=user_query,table="user_data")

            # email_data = {

            # }
            date_time =  dt.now().strftime("%Y-%m-%d_%H-%M-%S")
            data = user_fetch(user_id=userid)
            mail = {
                "user_name": name,
                "user_email": user_data["data"][0]["email"],
                "test_date": date_time,
                "session_id" : db_result_summary['result'][0]['session_id'],
                "pdf_link": url,
                "user_id":userid,
                "test_id": testid
            }
            email_data = EmailRequest(
            user_name=name,
            user_email=user_data["data"][0]["email"],
            test_date=date_time,
            session_id=db_result_summary['result'][0]['session_id'],
            pdf_link=url,
            user_id=userid,
            test_id=testid
            )

            result = email_service.send_email(email_data)
            print(result)
            # print(send_report_email(email_request=mail))
            return f"Successfully generated "
            # return send_email() # 200 - Sucess , 400 - Invalid Erorr , 501 - Server error
        elif data['status']==500:
            update_table(user_id=userid,test_id=testid,query={"quest_error":data['error']},table="summary_generation")
            data = ["none",agent_complete_time,"Failed",data['error'],""]
            print(paid_agent_sheet_update(data=data,testid=testid))
            paid_version(userid=userid,testid=testid)  # Call again if got the json decoder error
            return paid_version(userid=userid,testid=testid)
        elif data['status']==400:
            update_table(user_id=userid,test_id=testid,query={"quest_error":data['error']},table="summary_generation")
            data = ["none",agent_complete_time,"Failed",data['error'],""]
            print(paid_agent_sheet_update(data=data,testid=testid))
            paid_version(userid=userid,testid=testid)  # Call again if got the json decoder error
        
    else:
        print(f"Faiel to generate")
        print(f"status {data}")
        print(update_table(user_id=userid,test_id=testid,query={"quest_error":data['error']},table="summary_generation"))
        data = ["none",agent_complete_time,"Failed",data['error'],""]
        print(paid_agent_sheet_update(data=data,testid=testid))
        return paid_version(userid=userid,testid=testid)


## Fetching the user data with user id
@app.get("/api/userdashboard/{user_id}") # 
def user_dashboard(user_id:str):
    try:
        #print(f"here is user id {user_id}")
        data_summary = fetch_summary(user_id)
        #print(data_summary)
        print(f"Inside user dashboard")
        length = len(data_summary['result'])
        #print(f"length {length}")
        # payment_status= False
        # if data_summary['result'][0]["payment_status"]=="paid":
        #     payment_status= "True"
        data = []
        if length==0:
            {
                    'userid':user_id,
                    'testid':data_summary['result'][0]["testid"],
                    'sessionid':data_summary['result'][0]["session_id"],
                    'testtaken':data_summary['result'][0]["completion_time"],
                    'ispaymentdone':  data_summary['result'][0]['payment_status'],
                    'quest_pdf': data_summary['result'][0]["quest_pdf"],
                      "quest_pdf": data_summary['result'][i]["quest_pdf"]
                            }
            #print(f"Here is single data {data}")
            return {"status":200,"data":data}
        else:
            for i in range(length):
                data.append({
                    'userid':user_id,
                    'testid':data_summary['result'][i]["testid"],
                    'sessionid':data_summary['result'][i]["session_id"],
                    'testtaken':data_summary['result'][i]["completion_time"],
                    'ispaymentdone':  data_summary['result'][i]['payment_status'],
                    "quest_status": data_summary['result'][i]['quest_status'],
                    "quest_pdf": data_summary['result'][i]["quest_pdf"]
                            })
            #print(f"Her is multiple data {data}")
            return {"status":200,"data":data}

                
    except Exception as e:
        return {"status":401,"message":f"failed to fetch data due to {e}"}
    
    

# Generating the pdf 

# def generatepdf(data:dict,user_name:str):  # ,name:str data:dict

#     #print(f"Use name in generate pdf {name}")
#     #print(f"Here is data \n {data}")
#     print(f"type of data type in generte pdf {type(data)}")
    
#     # Structure the data properly for the template
#     template_data = {
#         "content": data
#     }
    
#     # Debug: Print the data structure
#     #print(f"Template data structure: {template_data}")
#     print(f"Content keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
    
#     with open("/home/harsimransingh27448/Quest/pdf_design/index.html", encoding='utf-8') as f:
#         template = Template(f.read())
#     html_content = template.render(**template_data)
#     print(html_content)
    
#     #print(f"After writng html content {html_content}")
#     # save html file to a temp file
#     try:

#         html_file = tempfile.NamedTemporaryFile(delete=False, suffix=".html")
#         html_file.write(html_content.encode('utf-8'))
#         html_file.close()
#         print(f"Here is html_content name {html_file.name}")

#     except Exception as e:
#         print(f"Failed to wreite html content due to {e}")
#         print(f"Html file {html_file}")
#     # temp pdf file path
#     print(f"Here after tempdf")
#     date = dt.now().strftime("%Y-%m-%d_%H-%M-%S")
#     user_name = user_name.replace(" ","_")
#     pdf_name =  f"Quest_{user_name}_{date}.pdf"
#     print(f"Here is pdf path {pdf_name}")
 
#     # 4️⃣ Call Puppeteer script
#     pdf_path = f"/home/harsimransingh27448/Quest/pdf_design/{pdf_name}"
#     print(subprocess.run(["/usr/bin/node", "generatepdf.js", html_file.name, pdf_name], check=True))

#     pdf_path = f"/home/harsimransingh27448/Quest/pdf_design/{pdf_name}"
#     conpressed_pdf = f"/home/harsimransingh27448/Quest/pdf_design/Compressed_{pdf_name}"
#     #compressed = f"../pdf_design/Compressed_{pdf_name}.pdf"
#     print(f"Path compress {conpressed_pdf}")
#     print(f"pdf path {pdf_path}")
#     print(compress_pdf(pdf_path,conpressed_pdf))    

#     print(f" PDF file Path {pdf_path}")

#     print(f"Pdf file Path {pdf_path}")
#     return {"Status":200,"Message":"Generated Successfully","pdf_path":pdf_path,"compress_pdf":conpressed_pdf}

    
     
# GHOSTSCRIPT = r"C:\Program Files\gs\gs10.05.1\bin\gswin64c.exe"
# def compress_pdf(input_file, output_file, quality='ebook'):
#     """
#     Compress PDF using Ghostscript.
#     quality options:
#         - screen   (low quality, smallest size)
#         - ebook    (medium quality)
#         - printer  (high quality)
#         - prepress (high quality, color preserving)
#     """
#     try:
#         # Ghostscript command
#         gs_command = [
#              "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
#             "-dPDFSETTINGS=/screen",
#             "-dNOPAUSE", "-dQUIET", "-dBATCH",
#             f"-sOutputFile={output_file}", input_file
#         ]
        
#         subprocess.run(gs_command, check=True)
#         return {"status":200,"message":"Sucessfully Compressed"}
#     except subprocess.CalledProcessError as e:
#         return f"Failed due to {e}"
#     except FileNotFoundError:
#         print("❌ Ghostscript not found. Please install it first.")



def generatepdf(data: dict, user_name: str,test_id:str,agent_start_time:str):
    """Generate PDF from HTML template with improved error handling"""
    print(f"------- PDF GENERATION START------")
    print(f"Starting PDF generation for user: {user_name}")
    print(f"Data type: {type(data)}")
    
    try:
        # Structure the data properly for the template
        template_data = {
            "content": data
        }
        query = {
            "quest_status":"Inside Generate PDf"
        }
        print(update_table_sum(table="summary_response",test_id=test_id,query=query))
        # Debug: Print the data structure
        print(f"Content keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
        
        # Read and render the HTML template
        template_path = "/home/harsimransingh27448/Quest/pdf_design/index.html"
        
        if not os.path.exists(template_path):
            return {"status": 400, "Message": f"Template file not found: {template_path}"}
        logging.info(f"After template path ,{template_path} ")
        with open(template_path, encoding='utf-8') as f:
            template = Template(f.read())
            print(f"Here is template")                                                                                          
        try:
            print(f"Inside html content ")
            html_content = template.render(**template_data)
            print(f"HTML content length: {len(html_content)} characters")
        except Exception as e:
            print(f"Here jhtmo not render {e}")
            return {"status": 400, "Message": f"HTML not render due to {e}"}
        # Save HTML to temporary file
        logging.info(f"HTml file saved")    
        html_file = None
        try:
            html_file = tempfile.NamedTemporaryFile(delete=False, suffix=".html", mode='w', encoding='utf-8')
            html_file.write(html_content)
            html_file.close()
            print(f"HTML file created: {html_file.name}")
            
            # Verify HTML file was written
            if os.path.getsize(html_file.name) == 0:
                return {"status": 400, "Message": "HTML file is empty"}
                
        except Exception as e:
            #print(f"Failed to write HTML content: {e}")
            if html_file:
                try:
                    os.unlink(html_file.name)
                except:
                    pass
            return {"status": 400, "Message": f"Failed to create HTML file: {e}"}
        
        # Generate PDF filename and path
        date = agent_start_time
        user_name_clean = user_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
        pdf_name = f"Quest_{user_name_clean}_{date}.pdf"
        pdf_path = f"/home/harsimransingh27448/Quest/pdf_design/{pdf_name}"
        
        print(f"PDF will be generated at: {pdf_path}")
        query = {
            "quest_status":"PDF Generating"
        }
        print(update_table_sum(table="summary_response",test_id=test_id,query=query))
        # Run Node.js PDF generation
        node_command = [
            "/usr/bin/node", 
            "/home/harsimransingh27448/Quest/generatepdf.js", 
            html_file.name, 
            pdf_name
        ]
        
        print(f"Running command: {' '.join(node_command)}")
        
        try:
            # Run with timeout and capture output
            result = subprocess.run(
                node_command, 
                check=True, 
                capture_output=True, 
                text=True, 
                timeout=120  # 2 minute timeout
            )
            
            print(f"Node.js stdout: {result.stdout}")
            if result.stderr:
                print(f"Node.js stderr: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            print("PDF generation timed out")
            return {"status": 500, "Message": "PDF generation timed out"}
        except subprocess.CalledProcessError as e:
            print(f"PDF generation failed: {e}")
            print(f"Stdout: {e.stdout}")
            print(f"Stderr: {e.stderr}")
            return {"status": 500, "Message": f"PDF generation failed: {e.stderr}"}
        finally:
            # Clean up HTML file
            try:
                os.unlink(html_file.name)
                print(f"Cleaned up temporary HTML file: {html_file.name}")
            except Exception as e:
                print(f"Failed to clean up HTML file: {e}")
        
        # Verify PDF was created
        if not os.path.exists(pdf_path):
            print(f"PDF file was not created at expected path: {pdf_path}")
            return {"status": 500, "Message": "PDF file was not created"}
        
        # Check PDF file size
        pdf_size = os.path.getsize(pdf_path)
        print(f"Generated PDF size: {pdf_size} bytes")
        
        if pdf_size < 1000:  # Less than 1KB is suspicious
            print("Warning: PDF file seems very small")
            return {"status": 400, "Message": "PDF file generated but appears to be empty or corrupted"}
        query = {
            "quest_status":"PDF Generated"
        }
        print(update_table_sum(table="summary_response",test_id=test_id,query=query))
        # Compress PDF
        compressed_pdf = f"/home/harsimransingh27448/Quest/pdf_design/Compressed_{pdf_name}"
        print(f"Compressing PDF to: {compressed_pdf}")
        query = {
            "quest_status":"Compressing PDF"
        }
        #update_table_sum(table="summary_response",test_id=test_id,query=query)
        compression_result = compress_pdf(pdf_path, compressed_pdf)
        print(f"Compression result: {compression_result}")
        query = {
            "quest_status":"PDF Compressed"
        }
        #update_table_sum(table="summary_response",test_id=test_id,query=query)
        return {
            "status": 200,
            "Message": "Generated Successfully",
            "pdf_path": pdf_path,
            "compress_pdf": compressed_pdf,
            "pdf_size": pdf_size
        }
        
    except Exception as e:
        print(f"Unexpected error in generatepdf: {e}")
        import traceback
        traceback.print_exc()
        return {"status": 500, "Message": f"Unexpected error: {str(e)}"}


def compress_pdf(input_file, output_file, quality='printer'):
    """
    Compress PDF using Ghostscript with better error handling.
    """
    try:
        # Check if input file exists

        print("----- COMPRESS PDF START -----")
        if not os.path.exists(input_file):
            return {"status": 400, "message": f"Input file does not exist: {input_file}"}
        
        # Ghostscript command for Linux
        gs_command = [
            "gs", 
            "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    f"-dPDFSETTINGS=/{quality}",
    # Custom downsampling instead of -dPDFSETTINGS
    "-dDownsampleColorImages=true",
    "-dDownsampleGrayImages=true",
    "-dDownsampleMonoImages=true",
    "-dColorImageResolution=200",
    "-dGrayImageResolution=200",
    "-dMonoImageResolution=200",
    "-dJPEGQ=90",   # image quality (75 = smaller, 90 = sharper)

            f"-sOutputFile={output_file}", 
            input_file
        ]
        
        print(f"Running Ghostscript: {' '.join(gs_command)}")
        
        result = subprocess.run(gs_command, check=True, capture_output=True, text=True)
        
        # Verify compressed file was created
        if os.path.exists(output_file):
            original_size = os.path.getsize(input_file)
            compressed_size = os.path.getsize(output_file)
            print(f"Compression: {original_size} -> {compressed_size} bytes")
            return {"status": 200, "message": "Successfully Compressed"}
        else:
            return {"status": 400, "message": "Compressed file was not created"}
            
    except subprocess.CalledProcessError as e:
        print(f"Ghostscript error: {e}")
        print(f"Stderr: {e.stderr}")
        return {"status": 400, "message": f"Compression failed: {e.stderr}"}
    except FileNotFoundError:
        return {"status": 400, "message": "Ghostscript not found. Please install it first."}
    except Exception as e:
        return {"status": 500, "message": f"Unexpected compression error: {str(e)}"}


## this function created to recreate the pdf that stuck in generate pdf function. 
def pdf_fetch():
    try:
        supabase_client: Client = create_client(API_URL, API_KEY)
        response = supabase_client.table("summary_generation").select("quest_status","testid","user_id","paid_agent_start_time").eq("payment_status","success").execute()
        return response.data
    except Exception as e:
        return f"Failed to fetch data due to {e}"



# def verify_pdf():
#     time.sleep(2400)  # wait for 40 minutes 
#     data = pdf_fetch()
#     lenght = len(data)
#     for i in range(lenght):
#         if data[i]['quest_status']!="generated":
#             current_time = dt.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
#             #print(f"Current time {current_time} and dtype {type(current_time)}")
#             agent_start_time = data[i]['paid_agent_start_time']
#             if agent_start_time is None:
#                 continue
#             else:
#                 dt1 = dt.fromisoformat(agent_start_time)
#                 dt2 = dt.fromisoformat(current_time)
#                 thirty_minutes = timedelta(minutes=30)
#                 one_hour = timedelta(hours=1)
#                 difference = dt2 - dt1
#                 print(f"One hour {type(one_hour)}")
#                 print(f"thirty minutes {type(thirty_minutes)}")
#                 #print(f"Agent time {agent_start_time}")
#                 if difference > one_hour and difference < thirty_minutes:
#                     print(f"Difference is greater")
#                 else:
#                     paid_version(userid=data['user_id'] , testid=data['test_id'])
                
# print(verify_pdf())

@app.get("/")
def api_testing():
    return {"status":"Api is working.."}

YOUR_KEY_ID= os.getenv("YOUR_KEY_ID")
YOUR_SECRET= os.getenv("YOUR_SECRET")

class Metadata(BaseModel):
    userAgent: str
    timestamp: str
    authenticationRequired: bool

class CreateOrderRequest(BaseModel):
    sessionId: str = Field(..., min_length=10, max_length=100)
    testId: str = Field(..., min_length=3, max_length=50)
    userId: str = Field(..., min_length=1)
    pricingTier: str = Field(..., pattern="^(early|regular)$")
    amount: int = Field(..., ge=100, le=10000000)  # in paise
    sessionStartTime: str
    metadata: Metadata
    isIndia: bool
    fixEmail : str 
    gateway : str
    #fixName: str

class PaymentData(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    amount: int
    currency: str
    status: str = Field(..., pattern="^(success|failed)$")

class TimingData(BaseModel):
    sessionToPaymentDuration: int  # in minutes
    authenticationDuration: Optional[int] = None  # in minutes

class PaymentMetadata(BaseModel):
    pricingTier: str = Field(..., pattern="^(early|regular)$")
    sessionStartTime: str
    paymentStartTime: str
    paymentCompletedTime: str
    authenticationFlow: bool
    userAgent: str
    timingData: TimingData

class PaymentCompletionRequest(BaseModel):
    userId: str
    originalSessionId: str
    testId: str
    paymentSessionId: str
    gateway : str
    orderid: str
    paymentData: PaymentData
    metadata: PaymentMetadata
    # paymentid :str 

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class ApiResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    message: Optional[str] = None

from datetime import datetime as dt

def generate_order_receipt(session_id: str, test_id: str) -> str:
    """Generate unique receipt ID for Razorpay order"""
  
    timestamp = dt.now().strftime("%Y%m%d_%H%M%S")
    return f"rcpt_{session_id[:10]}{test_id[:10]}{timestamp}"
YOUR_KEY_ID= os.getenv("YOUR_KEY_ID")
YOUR_SECRET = os.getenv("YOUR_SECRET")

client = razorpay.Client(auth=(YOUR_KEY_ID,YOUR_SECRET))

@app.get("/health")
async def health_check():
    return {"status":"healthy","timestamp":dt.now().strftime("%Y%m%d_%H%M%S")}
# paypal_client: PaypalServersdkClient = PaypalServersdkClient(
#     client_credentials_auth_credentials=ClientCredentialsAuthCredentials(
#         o_auth_client_id=os.getenv("PAYPAL_CLIENT_ID"),
#         o_auth_client_secret=os.getenv("PAYPAL_CLIENT_SECRET"),
#     ),
#     logging_configuration=LoggingConfiguration(
#         log_level=logging.INFO,
#         # Disable masking of sensitive headers for Sandbox testing.
#         # This should be set to True (the default if unset)in production.
#         mask_sensitive_headers=False,
#         request_logging_config=RequestLoggingConfiguration(
#             log_headers=True, log_body=True
#         ),
#         response_logging_config=ResponseLoggingConfiguration(
#             log_headers=True, log_body=True
#         ),
#     ),
# # )
# PAYPAL_ENVIRONMENT = os.getenv("PAYPAL_ENVIRONMENT", "sandbox").lower()  
# print(f"Paypal Environment status {PAYPAL_ENVIRONMENT}")
# if PAYPAL_ENVIRONMENT == "production":
#     paypal_base_url = "https://api-m.paypal.com"
#     mask_sensitive = True  # Enable masking in production
# else:
#     paypal_base_url = "https://api-m.sandbox.paypal.com"
#     mask_sensitive = False  # Disable masking for sandbox debugging

# paypal_client: PaypalServersdkClient = PaypalServersdkClient(
#     client_credentials_auth_credentials=ClientCredentialsAuthCredentials(
#         o_auth_client_id=os.getenv("PAYPAL_CLIENT_ID"),
#         o_auth_client_secret=os.getenv("PAYPAL_CLIENT_SECRET"),
#     ),
#     base_url=paypal_base_url,
#     logging_configuration=LoggingConfiguration(
#         log_level=logging.INFO,
#         mask_sensitive_headers=False,  # True in production is safer
#         request_logging_config=RequestLoggingConfiguration(
#             log_headers=True, log_body=True
#         ),
#         response_logging_config=ResponseLoggingConfiguration(
#             log_headers=True, log_body=True
#         ),
#     ),

# )


import paypalrestsdk
# import paypal_config


PAYPAL_ENVIRONMENT = os.getenv("PAYPAL_ENVIRONMENT").lower()
print(f"Paypal Environment status: {PAYPAL_ENVIRONMENT}")

if PAYPAL_ENVIRONMENT in ["production", "live"]:
    paypal_base_url = "https://api-m.paypal.com"
    
    mask_sensitive = True  # Enable masking in production/live

# paypal_client: PaypalServersdkClient = PaypalServersdkClient(
#     client_credentials_auth_credentials=ClientCredentialsAuthCredentials(
#         o_auth_client_id=os.getenv("PAYPAL_CLIENT_ID"),
#         o_auth_client_secret=os.getenv("PAYPAL_CLIENT_SECRET"),
#     ),

#     logging_configuration=LoggingConfiguration(
#         log_level=logging.INFO, 
#         mask_sensitive_headers=mask_sensitive,  # Use the correct mask flag
#         request_logging_config=RequestLoggingConfiguration(
#             log_headers=True, log_body=True
#         ),
#         response_logging_config=ResponseLoggingConfiguration(
#             log_headers=True, log_body=True
#         ),
#     ),
# )

environment = LiveEnvironment(
    client_id=os.getenv("PAYPAL_CLIENT_ID"),
    client_secret=os.getenv("PAYPAL_CLIENT_SECRET")
)
paypal_client: PaypalServersdkClient = PaypalServersdkClient(
    # server="live",   # 👈 THIS IS THE IMPORTANT LINE
  
    client_credentials_auth_credentials=ClientCredentialsAuthCredentials(
        o_auth_client_id=os.getenv("PAYPAL_CLIENT_ID"),
        o_auth_client_secret=os.getenv("PAYPAL_CLIENT_SECRET"),
    ),
     
    logging_configuration=LoggingConfiguration(
        log_level=logging.INFO,
        mask_sensitive_headers=True,
        request_logging_config=RequestLoggingConfiguration(
            log_headers=True, log_body=True
        ),
        response_logging_config=ResponseLoggingConfiguration(
            log_headers=True, log_body=True
        ),
    ),
)

paypalrestsdk.configure({
    "mode": "live",  # Use "live" for production
    "client_id": os.getenv("PAYPAL_CLIENT_ID"),
    "client_secret": os.getenv("PAYPAL_CLIENT_SECRET")
})


orders_controller: OrdersController = paypal_client.orders
payments_controller: PaymentsController = paypal_client.payments


@app.post("/api/payments/create-order")
def create_order(order_data : CreateOrderRequest):
    try:
        PAYPAL_ENVIRONMENT = os.getenv("PAYPAL_ENVIRONMENT").lower() 
        print(f"API Keys {YOUR_KEY_ID} {YOUR_SECRET}")
        #client = razorpay.Client(auth=("YOUR_KEY_ID","YOUR_SECRET"))
        print(f"Paypal Environment status {PAYPAL_ENVIRONMENT}")
        client = razorpay.Client(auth=(YOUR_KEY_ID,YOUR_SECRET))
        
        logging.info(f"Client {client}")
        receipt = generate_order_receipt(order_data.sessionId,order_data.testId)
        print(f"In create order recipt {receipt}")
        logging.info(f"In create order recipt {receipt}")   
        print(f"PayPal Base URL being used: {paypal_base_url}")
        print(f"----- Order Data ---- {order_data}")
        if order_data.gateway =="razorpay":  # razorpay

            if order_data.isIndia== True:
                print(f"Order Data IsINDIA {order_data.isIndia}")
                data = {
            "amount": order_data.amount,  # Amount in paise
            "currency": "INR",
            "receipt": receipt,
            "notes": {
                "user_id": order_data.userId,
                "session_id": order_data.sessionId,
                "test_id": order_data.testId,
                "pricing_tier": order_data.pricingTier,
                "session_start_time": order_data.sessionStartTime,
            }
        }   
                print(f"Data create order {data}")
                logging.info(f"Data create order {data}")
                # transaction_details()
                razorpay_order = client.order.create(data=data) 
                print(f"Razpor pay order {razorpay_order}")
                payment_session_id = f"ps_{order_data.sessionId}{dt.now().strftime('%Y%m%d%H%M%S')}"
                # print(f"Payment sessson id {payment_session_id}")
                # logging.info(f"Payment session id {payment_session_id}")
                response_data = {
                    "razorpayOrderId": razorpay_order["id"],
                    "gateway":order_data.gateway,
                    "amount": razorpay_order["amount"],
                    "currency": razorpay_order["currency"],
                    "paymentSessionId": payment_session_id
                }

                query = {
                    "user_id": order_data.userId,
                    "session_id":  order_data.sessionId,
                    "testid":order_data.testId,
                    "session_start_time": order_data.sessionStartTime,
                    "status": "Start",
                    "IsIndia":order_data.isIndia,
                    "gateway":"Razorpay"

                }
                print(f"Here is query of db to isert for payment {query}")
                print(data_insert(query=query,table="transaction_details"))
                query = {
                    "payment_status": "Start"
                }
                print(update_table_sum(table="summary_generation",test_id=order_data.testId,query=query))
                logging.info(f"Responsde data type {type(response_data)}")

                query = {
                    "email": order_data.fixEmail
                }

                print(f"Update the user table for email")
                print(update_user_table(table="user_data",user_id=order_data.userId,query=query))
                print(f"Resposne data {response_data}")
                data = [ "None","None","Order Create",razorpay_order['amount'],order_data.sessionStartTime," ","Start"]
                print(transactions_sheet_append(data=data,testid=order_data.testId))

                logging.info(f"Response data {response_data}")
                return ApiResponse(
            success=True,
            data=response_data,
            message="Order created successfully"
        )
            else:  # if person select razor pay and outside india
                data = {
            "amount": order_data.amount,  # Amount in paise
            "currency": "USD",
            "receipt": receipt,
            "notes": {
                "user_id": order_data.userId,
                "session_id": order_data.sessionId,
                "test_id": order_data.testId,
                "pricing_tier": order_data.pricingTier,
                "session_start_time": order_data.sessionStartTime,
            }
        }   
                print(f"Data create order {data}")
                logging.info(f"Data create order {data}")
                # transaction_details()
                razorpay_order = client.order.create(data=data) 
                print(f"Razpor pay order {razorpay_order}")
                payment_session_id = f"ps_{order_data.sessionId}{dt.now().strftime('%Y%m%d%H%M%S')}"
                # print(f"Payment sessson id {payment_session_id}")
                # logging.info(f"Payment session id {payment_session_id}")
                
#   "gateway": "razorpay",
#   "razorpayOrderId": "order_MQaKrC0JKo3sYT",
#   "amount": 95000,
#   "currency": "INR",
#   "paymentSessionId": "payment_session_123"
                response_data = {
                    "razorpayOrderId": razorpay_order["id"],
                    "gateway":order_data.gateway,
                    "amount": razorpay_order["amount"],
                    "currency": razorpay_order["currency"],
                    "paymentSessionId": payment_session_id
                }

                query = {
                    "user_id": order_data.userId,
                    "session_id":  order_data.sessionId,
                    "testid":order_data.testId,
                    "session_start_time": order_data.sessionStartTime,
                    "status": "Start",
                    "IsIndia":order_data.isIndia,
                    "gateway":"Razorpay"

                }
                print(f"Here is query of db to isert for payment {query}")
                print(data_insert(query=query,table="transaction_details"))
                query = {
                    "payment_status": "Start"
                }
                print(update_table_sum(table="summary_generation",test_id=order_data.testId,query=query))
                logging.info(f"Responsde data type {type(response_data)}")

                query = {
                    "email": order_data.fixEmail
                }

                print(f"Update the user table for email")
                print(update_user_table(table="user_data",user_id=order_data.userId,query=query))
                print(f"Resposne data {response_data}")
                data = [ "None","None","Order Create",razorpay_order['amount'],order_data.sessionStartTime," ","Start"]
                print(transactions_sheet_append(data=data,testid=order_data.testId))

                logging.info(f"Response data {response_data}")


                return ApiResponse(
            success=True,
            data=response_data,
            message="Order created successfully"
        )

                # now paypal system
        else:
            # order_data.amount = order_data.amount / 100
            # amount_usd = round(order_data.amount / 100, 2)
            # order_data.amount = f"{amount_usd:.2f}"  # "1.00" instead of 1.0 

    #         print(f"Here is amount {type(order_data.amount)} and {order_data.amount}")
    #         order = orders_controller.create_order(
    #     {
    #         "body": OrderRequest(
    #             intent=CheckoutPaymentIntent.CAPTURE,
    #             purchase_units=[
    #                 PurchaseUnitRequest(
    #                     amount=AmountWithBreakdown(
    #                         currency_code="USD",
    #                         value=order_data.amount,
    #                         breakdown=AmountBreakdown(  
    #                             item_total=Money(currency_code="USD", value=order_data.amount)
    #                         ),
    #                     ),
    #                     items=[
    #                         Item(
    #                             name="Quest PDF",
    #                             unit_amount=Money(currency_code="USD", value=order_data.amount),
    #                             quantity="1",
    #                             description="Quest Paid PDF",
    #                             sku="sku01",
    #                             category=ItemCategory.DIGITAL_GOODS,
    #                         )
    #                     ],

    #                 )
    #             ],


    #         )
    #     }
    # )     
            from decimal import Decimal
            amount = f"{Decimal(order_data.amount):.2f}"  # ensures '1.00'
            payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "redirect_urls": {
            "return_url": "https://yourdomain.com/paypal/return",
            "cancel_url": "https://yourdomain.com/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Item",
                    "sku": "item",
                    "price": amount,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "total": amount,
                "currency": "USD"
            },
            "description": "Payment description"
        }]
    })
            print(f"Paypal Order create -------  {payment}")
            if payment.create():
                
            
                

        # data = {
        #     "amount": order_data.amount,  # Amount in paise
        #     "currency": "INR",
        #     "receipt": receipt,
        #     "notes": {
        #         "user_id": order_data.userId,
        #         "session_id": order_data.sessionId,
        #         "test_id": order_data.testId,
        #         "pricing_tier": order_data.pricingTier,
        #         "session_start_time": order_data.sessionStartTime,
        #     }
        # }   
            # print(f"Data create order {data}")
            # logging.info(f"Data create order {data}")
        # transaction_details()
            # razorpay_order = client.order.create(data=data) 
            # print(f"Razpor pay order {razorpay_order}")


                payment_session_id = f"ps_{order_data.sessionId}{dt.now().strftime('%Y%m%d%H%M%S')}"
        # print(f"Payment sessson id {payment_session_id}")
        # logging.info(f"Payment session id {payment_session_id}")
                approval_url = None
                if hasattr(payment.body, 'links'):
                    for link in payment.body.links:
                        if link.rel == 'approve':
                            approval_url = link.href
                            break
                print(f"Here is approveal url {approval_url}")
                response_data = {
                "paypalOrderId": payment.id, 
                "gateway": "paypal",
                "amount": order_data.amount,
                "currency": "USD",
                "paymentSessionId": payment_session_id,
               "approval_url": next(link.href for link in payment.links if link.rel == "approval_url") } #payer_id
                

                query = {
            "user_id": order_data.userId,
            "session_id":  order_data.sessionId,
            "testid":order_data.testId,
            "session_start_time": order_data.sessionStartTime,
            "status": "Start",
            "IsIndia":order_data.isIndia,
            "gateway": order_data.gateway,
            "paypal_order_id": payment.id,
            
        }
                print(f"Here is query of db to isert for payment {query}")
                print(data_insert(query=query,table="transaction_details"))
                query = {
            "payment_status": "Start"
        }
                print(update_table_sum(table="summary_generation",test_id=order_data.testId,query=query))
                logging.info(f"Responsde data type {type(response_data)}")

                query = {
            "email": order_data.fixEmail
        }
                print(f"Resposne data {response_data}")
       

                logging.info(f"Response data {response_data}")
                return ApiResponse(
            success=True,
            data=response_data,
            message="Order created successfully"
        )

    except Exception as e:
        query = {
            "user_id": order_data.userId,
            "session_id":  order_data.sessionId,
            "testid":order_data.testId,
            "session_start_time": order_data.sessionStartTime,
            "status": f"Failed due to {e}",
        }
        print(data_insert(query=query,table="transaction_details"))
        query = {
            "payment_status": f"Failed due to {e}"
        }
        print(update_table_sum(table="summary_generation",test_id=order_data.testId,query=query))
        print(f"Fialed to create order due to {e}")
        return f"Failed to create order due to {e}"


@app.post("/api/payments/complete")
async def complete_payment(payment_data: PaymentCompletionRequest, background_tasks: BackgroundTasks):
    
    try:    
        if payment_data.gateway =="razorpay":

            is_valid = verify_razorpay_signature(
                payment_data.paymentData.razorpay_order_id,
                payment_data.paymentData.razorpay_payment_id,
                payment_data.paymentData.razorpay_signature,
                YOUR_SECRET
            )
            print(f"In complete payment {is_valid}")
            if not is_valid:
                logging.warning(f"Invalid payment signature for payment: {payment_data.paymentData.razorpay_payment_id}")
                raise HTTPException(
                    status_code=400,
                    detail="Invalid payment signature"
                )
        
            payment_info = {
                "user_id": payment_data.userId,
                "original_session_id": payment_data.originalSessionId,
                "test_id": payment_data.testId,
                 "payment_session_id": payment_data.paymentSessionId,
                "razorpay_order_id": payment_data.paymentData.razorpay_order_id,
                "razorpay_payment_id": payment_data.paymentData.razorpay_payment_id,
                "amount": payment_data.paymentData.amount,
                "currency": payment_data.paymentData.currency,
                "status": payment_data.paymentData.status,
                "pricing_tier": payment_data.metadata.pricingTier,
                "session_start_time": payment_data.metadata.sessionStartTime,
                "payment_completed_time": payment_data.metadata.paymentCompletedTime,
                # "authentication_flow": payment_data.metadata.authenticationFlow,
                "session_duration": payment_data.metadata.timingData.sessionToPaymentDuration,
                "auth_duration": payment_data.metadata.timingData.authenticationDuration,
            }
        
            query = {
            "user_id": payment_data.userId,
            "payment_session_id":payment_data.paymentSessionId,
            "order_id": payment_data.paymentData.razorpay_order_id,
            "payment_id": payment_data.paymentData.razorpay_payment_id,
            "total_paid": payment_data.paymentData.amount,
            "status":payment_data.paymentData.status,
            "payment_completed_time":payment_data.metadata.paymentCompletedTime,
            "session_duration":payment_data.metadata.timingData.sessionToPaymentDuration,
            "date":datetime.datetime.now(datetime.timezone.utc).isoformat(),
        }
            print(f"Here is query in complete payment {query}")
            print(update_table_payment(table="transaction_details",user_id=payment_data.userId,test_id=payment_data.testId,query=query)) # need to change , update based on user id but also on sesssion id
            print(f"Payment status update in summary")
            print(update_table_sum(table="summary_generation",test_id=payment_data.testId,query={"payment_status":payment_data.paymentData.status,"quest_status":"working"}))
            print(f"Pyyaymnet infomation {payment_info}")
            logging.info(f"Pyyaymnet infomation {payment_info}")
            logging.info(f"Payment completed successfully: {payment_info}")

        
            background_tasks.add_task(paid_version, payment_data.userId, payment_data.testId)
            response_data = {
  "success": True,
  "message": "Payment completed successfully",
  "paymentId": payment_id,
  "gateway": "razorpay"
}
            return ApiResponse(
                success=True,
                data=response_data,
                message="Payment processed successfully"
            )
        else:

    #         order = orders_controller.capture_order(
    #     {"id": payment_data.orderid, "prefer": "return=representation"}

    # )       
    #         order_body = order.body
    #         purchase_unit = order_body.purchase_units[0]
    #         capture = purchase_unit.payments.captures[0]
    #         query = {
    #         "user_id": payment_data.userId,
    #         "payment_session_id":payment_data.paymentSessionId,
    #         "order_id": payment_data.paymentData.razorpay_order_id,
    #         "payment_id":capture.id,
    #         "total_paid": capture.amount.value,
    #         "status":capture.status,
    #         "payment_completed_time":payment_data.metadata.paymentCompletedTime,
    #         "session_duration":payment_data.metadata.timingData.sessionToPaymentDuration,
    #         "date":datetime.datetime.now(datetime.timezone.utc).isoformat(),
    #         "paypal_payment_id":capture.id
    #     } 
            payment_id = payment_data.paymentData.paypal_order_id
            payer_id = payment_data.paymentData.payer_id
            print(f"Here is payer id {payer_id}")
            payment = paypalrestsdk.Payment.find(payment_id)
            if payment.execute({"payer_id": payer_id}):
                
                query = {
            "user_id": payment_data.userId,
            "payment_session_id":payment_data.paymentSessionId,
            "order_id": payment_id,
            "payment_id": payment_id,
            "total_paid": payment_data.paymentData.amount,
            "status":payment_data.paymentData.status,
            "payment_completed_time":payment_data.metadata.paymentCompletedTime,
            "session_duration":payment_data.metadata.timingData.sessionToPaymentDuration,
            "date":datetime.datetime.now(datetime.timezone.utc).isoformat(),
                  }
                print(f"Here is query in complete payment {query}")
                print(update_table_payment(table="transaction_details",user_id=payment_data.userId,test_id=payment_data.testId,query=query)) # need to change , update based on user id but also on sesssion id
                print(f"Payment status update in summary")
                print(update_table_sum(table="summary_generation",test_id=payment_data.testId,query={"payment_status":payment_data.paymentData.status,"quest_status":"working"}))
                response_data = {
                    "success": True,
                    "message": "Payment completed successfully",
                    "paymentId": payment_id,
                    "gateway": "paypal"
                    }               
                print(f"----- Sucessfuly Paypal Completet ------")
                background_tasks.add_task(paid_version, payment_data.userId, payment_data.testId)
                return ApiResponse(
                    sucess=True,
                    data= response_data,
                    message="Successfully Payment"
                )
            else:
                query = {
            "user_id": payment_data.userId,
            "payment_session_id":payment_data.paymentSessionId,
            "order_id": payment_id,
            "payment_id": payment_id,
            "total_paid": payment_data.paymentData.amount,
            "status":'Failed to Complete',
            "payment_completed_time":payment_data.metadata.paymentCompletedTime,
            "session_duration":payment_data.metadata.timingData.sessionToPaymentDuration,
            "date":datetime.datetime.now(datetime.timezone.utc).isoformat(),
                  }
                print(f"Here is query in complete payment {query}")
                print(update_table_payment(table="transaction_details",user_id=payment_data.userId,test_id=payment_data.testId,query=query)) # need to change , update based on user id but also on sesssion id
                print(f"Payment status update in summary")
                print(update_table_sum(table="summary_generation",test_id=payment_data.testId,query={"payment_status":"Failed","quest_status":"Not"}))
                response_data = {
  "success": False,
  "message": "Payment Completion Failed",
  "paymentId": payment_id,
  "gateway": "paypal"
                }
                print(f"---- Failed to Complete Paypal Payment -----")
                return ApiResponse(
                    sucess=False,
                    data=response_data,
                    message="Payment Completion Failed"
                )

    except Exception as e:
        query = {
            "user_id": payment_data.userId,
            "payment_session_id":payment_data.paymentSessionId,
            "order_id": payment_data.paymentData.razorpay_order_id,
            "payment_id": payment_data.paymentData.razorpay_payment_id,
            "total_paid": payment_data.paymentData.amount,
            "status":payment_data.paymentData.status,
            "payment_completed_time":payment_data.metadata.paymentCompletedTime,
            "session_duration":payment_data.metadata.timingData.sessionToPaymentDuration

        }
        print(f"Here is query in complete payment {query}")
        print(update_table_payment(table="transaction_details",user_id=payment_data.userId,test_id=payment_data.testId,query=query))
        print(update_table_sum(table="summary_generation",test_id=payment_data.testId,query={"payment_status":payment_data.paymentData.status,"quest_status":f"Failed due to {e}"}))
       
        background_tasks.add_task(paid_version, payment_data.userId, payment_data.testId)
        return f"Failed to complete due to {e}"



## AFter sigin updating user id 


API_URL_FR = os.getenv("API_URL")
API_KEY_FR = os.getenv("API_KEY")

def sign_in_fetch(user_id:str):
    try:
        UID = user_id
        supabase_client: Client = create_client(API_URL_FR, API_KEY_FR)
        #response = supabase_client.table("summary_generation").select("*")
        response = supabase_client.auth.admin.get_user_by_id(UID)
        return response.user
    except Exception as e:
        return f"Failed to fetch data due to {e}"

@app.post("/api/saveusingsignin")
async def sigin(request : Request):
    print(f"Inside sigin ")
    data = await request.json()
    print(f"here is in {data}")
    user_id = data['userId']
    testid = data['testId']
    #session_id = data['sessionId']
    data = sign_in_fetch(user_id=user_id)

    print(f"Data {type(data)}")
    print(f"User data is sign in {data}")
    check_signin_account = user_fetch(user_id=user_id) #fetch the allraeady sign in account 
    #if check_signin_account[0]['user_id']
    
    user_name = data.user_metadata.get("full_name")
    email = data.email
    print(f"{user_name}")
    print(email)
    #print(f"Here is data of sigin {data}")
    result = user_fetch(user_id=user_id)
    db_result_summary = fetch(testid=testid) 
    old_user_id = db_result_summary['result'][0]['user_id']
    #old_user_id = result['user_id']
    if result['status'] == 'Found':  # if account created allreadys and sign in again then just repalce the user id of summ with signed user id
        query = {
            "user_id":user_id,
        }         
        result = update_table_sum(test_id=testid,table="summary_generation",query=query)  # after updateing with signed account , then remove anoymous account
        query = {
            "user_id": user_id
        }
        print(update_table_sum(test_id=testid,table="summary_question_answer",query=query))
        print(remove_row(user_id=old_user_id))
        query = {
            "user_id":user_id,
             "email":email,
            "user_name":user_name,
        }
        print(update_user_table(table="user_data",user_id=user_id,query=query))
        query = {
            "user_id":user_id
        }
        print(update_feedback(table="free_feedback",test_id=testid,query=query))
        print(result)
        data = user_id
        print(user_data_cell_update(data=data,testid=testid,col=7))
        return result
    else: # if user comes first time and want to sign in then update sing nin deatils
        db_result_summary = fetch(testid=testid) 
        old_user_id = db_result_summary['result'][0]['user_id']
        query = {
            "user_id": user_id,
        "is_anonymous":"false",
         "email":email,
            "user_name":user_name,
        }
        result = update_user_table(table="user_data",user_id=old_user_id,query=query)
        query = {
            "user_id": user_id
        }
        print(update_table_sum(test_id=testid,table="summary_question_answer",query=query))
        query = {
            "user_id":user_id
        }
        print(update_feedback(table="free_feedback",test_id=testid,query=query))
        data = user_id
        print(user_data_cell_update(data=data,testid=testid,col=7))
        data = False
        print(user_data_cell_update(data=data,testid=testid,col=6))
        return result
    
    


# @app.post("/api/payments/verify")
# def verify_payment(verify_data: VerifyPaymentRequest):
#     try:
#         print(f"API key {YOUR_SECRET}")
#         is_valid = verify_razorpay_signature(
#             verify_data.razorpay_order_id,
#             verify_data.razorpay_payment_id,
#             verify_data.razorpay_signature,
#             YOUR_SECRET
#         )
    
#         # params_dict = {
#         #     'razorpay_order_id': data.razorpay_order_id,
#         #     'razorpay_payment_id': data.razorpay_payment_id,
#         #     'razorpay_signature': data.razorpay_signature
#         # }
#         # Verify signature
#         # client.utility.verify_payment_signature(params_dict)
#         return ApiResponse(
#             success=True,
#             data={"verified": is_valid},
#             message="Payment verification completed"
#         )
        

#         #return {"status": "success"}
#     except razorpay.errors.SignatureVerificationError:
#         return {"status":500,"message":"payment faield to verify"}
    

def verify_razorpay_signature(order_id: str, payment_id: str, signature: str, secret: str) -> bool:
    """Verify Razorpay payment signature"""
    try:
        # Create the message that was signed
        message = f"{order_id}|{payment_id}"
        
        # Generate the expected signature
        expected_signature = hmac.new(
            secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Compare signatures
        return hmac.compare_digest(expected_signature, signature)
        
    except Exception as e:
        print(f"Signature verification error: {e}")
        return False


# "/api/quest/paid/feedback" paid feedback

# # Email configuration from environment variables

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL")
FROM_NAME = os.getenv("FROM_NAME")

print("SMTP_HOST:", SMTP_HOST)
print("SMTP_PORT:", SMTP_PORT)
print("SMTP_USERNAME:", SMTP_USERNAME)
print("SMTP_PASSWORD:", SMTP_PASSWORD)
print("FROM_EMAIL:", FROM_EMAIL)
print("FROM_NAME:", FROM_NAME)

class EmailConfig:
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = os.getenv("SMTP_PORT")
    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    FROM_EMAIL = os.getenv("FROM_EMAIL")
    FROM_NAME = os.getenv("FROM_NAME")
    
    @classmethod
    def validate_config(cls):
        """Validate that all required email configuration is present"""
        if not all([cls.SMTP_USERNAME, cls.SMTP_PASSWORD]):
            raise ValueError("Missing required email configuration: MAILTRAP_USERNAME, MAILTRAP_PASSWORD")

# Request model
class EmailRequest(BaseModel):
    user_name: str
    user_email: EmailStr
    test_date: str
    session_id: str
    pdf_link: str
    user_id: str
    test_id: str

# Response model
class EmailResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    error: Optional[str] = None

class EmailService:
    def __init__(self):
        EmailConfig.validate_config()

    def generate_email_html(self, data: EmailRequest) -> str:
        """Generate professional HTML email template"""
        return f'''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Full AI-Psychoanalysis Report is Ready</title>
  <style>
    body {{
      font-family: "Helvetica Neue", Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
      color: #333;
    }}
    .container {{
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }}
    .header {{
      background: linear-gradient(135deg, #00B4DB, #0083B0);
      padding: 60px 30px 50px;
      text-align: center;
      color: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }}
    .header h1 {{
      font-size: 32px;
      margin: 0;
      font-weight: 800;
      letter-spacing: -0.5px;
    }}
    .header p {{
      font-size: 16px;
      opacity: 0.95;
      margin-top: 14px;
      line-height: 1.5;
    }}
    .content {{
      padding: 32px;
    }}
    p {{
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 22px;
    }}
    a.cta-btn {{
      display: inline-block;
      background: linear-gradient(135deg, #00B4DB, #0083B0);
      color: white;
      padding: 18px 36px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 17px;
      margin: 24px 0;
    }}
    a.cta-btn:hover {{
      opacity: 0.95;
    }}
    .highlight {{
      background: #f4f7ff;
      padding: 18px 22px;
      border-left: 5px solid #0083B0;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 500;
      color: #222;
      margin-bottom: 28px;
    }}
    .footer {{
      font-size: 13px;
      color: #888;
      text-align: center;
      padding: 20px 30px;
      border-top: 1px solid #eee;
    }}
    a {{
      color: #0083B0;
      text-decoration: none;
    }}
    a:hover {{
      text-decoration: underline;
    }}
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Your Report is Ready</h1>
      <p>Thank you for exploring yourself with Quest by Fraterny</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p>
        Your full AI-powered psychoanalysis report can be finally downloaded. This personalized guide is designed to help you gain deep insight and clarity.
      </p>

      <a href="{data.pdf_link}" class="cta-btn">📄 Download My Report</a>

      <p>
        You can also obtain your report anytime from your dashboard
     
      </p>

      <p>
        <strong>Your data is completely private.</strong> We don't share or sell your responses to anyone.
      </p>

      <div class="highlight">
        💡 <strong>We value your input!</strong><br>
        Share your thoughts on the report to help us improve.<br>
        You can even receive a revised version based on your feedback.
      </div>

      <p>
        Need help or want to regenerate your report? Email us anytime at  
        <a href="mailto:support@fraterny.com">support@fraterny.com</a>.
      </p>
    </div>

    <div class="footer">
      © 2025 Fraterny — AI-Powered Self-Knowledge
    </div>
  </div>
</body>
</html>'''

    def generate_email_text(self, data: EmailRequest) -> str:
        """Generate plain text version of email"""
        return f"""
Hello {data.user_name},

Thank you for completing your Fraterny QUEST assessment! Your detailed personality report is now ready.

Assessment Details:
- Date: {data.test_date}
- Session ID: {data.session_id}
- Report Type: Comprehensive Personality Analysis

Your comprehensive report includes:
• Detailed personality assessment results
• Professional insights and recommendations
• Career guidance based on your profile
• Personal development suggestions

Download your report: {data.pdf_link}

Important: This download link is secure and personalized for you. Please save your report for future reference.

Need Help?
If you have any questions about your report or need assistance, please contact our support team at support@fraterny.com

Best regards,
The Fraterny Team

© 2025 Fraterny. All rights reserved.
This email was sent to {data.user_email}
Fraterny - Unlocking Human Potential Through Assessment
        """

    def send_email(self, email_data: EmailRequest) -> EmailResponse:
        """Send email using Mailtrap SMTP"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"Your Fraterny QUEST Assessment Report - {email_data.user_name}"
            msg['From'] = formataddr((EmailConfig.FROM_NAME, EmailConfig.FROM_EMAIL))
            msg['To'] = email_data.user_email
            msg['Reply-To'] = "support@fraterny.in"
            logging.info(f"{msg['Subject']} , {msg['From']} , {msg['Reply-To']} , {msg['To']}")
            # Create both plain text and HTML versions
            text_content = self.generate_email_text(email_data)
            html_content = self.generate_email_html(email_data)
            
            # Attach parts
            text_part = MIMEText(text_content, 'plain', 'utf-8')
            html_part = MIMEText(html_content, 'html', 'utf-8')
            
            msg.attach(text_part)
            msg.attach(html_part)
            #logging.info(f"Message {msg}")
            # Send email
            with smtplib.SMTP(EmailConfig.SMTP_HOST, EmailConfig.SMTP_PORT) as server:
                server.starttls()  # Enable encryption
                server.login(EmailConfig.SMTP_USERNAME, EmailConfig.SMTP_PASSWORD)
                server.send_message(msg)
            
            logging.info(f"Email sent successfully to {email_data.user_email} for session {email_data.session_id}")
            
            return EmailResponse(
                success=True,
                message="Email sent successfully"
            )
            
        except smtplib.SMTPAuthenticationError:
            logging.error("SMTP Authentication failed - check credentials")
            return EmailResponse(
                success=False,
                error="Email service authentication failed"
            )
        except smtplib.SMTPRecipientsRefused:
            logging.error(f"Recipient refused: {email_data.user_email}")
            return EmailResponse(
                success=False,
                error="Invalid recipient email address"
            )
        except smtplib.SMTPException as e:
            logging.error(f"SMTP error: {str(e)}")
            return EmailResponse(
                success=False,
                error="Email service temporarily unavailable"
            )
        except Exception as e:
            logging.error(f"Unexpected error sending email: {str(e)}")
            return EmailResponse(
                success=False,
                error="Failed to send email"
            )

# Initialize email service
email_service = EmailService()

def send_email_background(email_data: EmailRequest):
    """Background task to send email"""
    try:
        result = email_service.send_email(email_data)
        if not result.success:
            logging.error(f"Background email failed: {result.error}")
    except Exception as e:
        logging.error(f"Background email task failed: {str(e)}")

@app.post("/send-report-email", response_model=EmailResponse)
async def send_report_email(
    email_request: EmailRequest,
    # background_tasks: BackgroundTasks
):
    """
    Send report email endpoint
    
    This endpoint receives email data from the frontend and sends a professional
    email with the user's assessment report link.
    """
    try:
        # Log the request (without sensitive data)
        logging.info(f"Email request for user: {email_request.user_email}, session: {email_request.session_id}")
        print()
        # Validate email data
        if not email_request.pdf_link.startswith(('http://', 'https://')):
            raise HTTPException(
                status_code=400, 
                detail="Invalid PDF link provided"
            )
        
        # Option 1: Send email synchronously (immediate response)
        print(f"{SMTP_HOST} \n {SMTP_PASSWORD} \n {SMTP_PORT} \n {SMTP_USERNAME}")
        result = email_service.send_email(email_request)
        print(f"Here is result {result}")
        if result.success:
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "Email sent successfully"
                }
            )
        else:
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": result.error
                }
            )
        
        # Option 2: Send email asynchronously (uncomment to use)
        # background_tasks.add_task(send_email_background, email_request)
        # return JSONResponse(
        #     status_code=200,
        #     content={
        #         "success": True,
        #         "message": "Email is being sent"
        #     }
        # )
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"API endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error"
        )

@app.get("/email-status")
async def get_email_status():
    """Health check endpoint for email service"""
    try:
        # Test SMTP connection
        with smtplib.SMTP(EmailConfig.SMTP_HOST, EmailConfig.SMTP_PORT) as server:
            server.starttls()
            server.login(EmailConfig.SMTP_USERNAME, EmailConfig.SMTP_PASSWORD)
            
        return {
            "status": "healthy",
            "smtp_host": EmailConfig.SMTP_HOST,
            "smtp_port": EmailConfig.SMTP_PORT,
            "from_email": EmailConfig.FROM_EMAIL
        }
    except Exception as e:
        logging.error(f"Email service health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": "SMTP connection failed"
        }
    



## Linux Dirctory root

# /home/harsimransingh27448/Quest

# harsimransingh27448@quest-20250729-103328:~/Quest$ ls
# 'Brain_Mapping_Harsimran Singh.pdf'   __pycache__                 cover_book       main.py             package.json        person_images                                        pychology_brain_mapping_content_harsimran_v1.3.pdf   static
#  Depth_analsis.pdf                    agent.py                    faiss_index      mainte.py           paidagent.py        plottesting.py                                       pychology_brain_mapping_content_yash_v1.3.pdf        testcontent.py
# 'General Guidelines.pdf'              answer_interpretation.pdf   generatepdf.js   multiagent.py       paymenttesting.py   pychology_brain_mapping_content_demo_v1.3.pdf        pychology_content_demo_v1.4.2.pdf                    thumbnails
#sessionsns.pdf                        blindspot.png               gilroy           node_modules        pdf_design          pychology_brain_mapping_content_demo_v1.4.pdf        pychology_content_demo_v1.4.pdf                      venv
#  READ.md                            content_automation.py       images           package-lock.json   pdf_design.html     pychology_brain_mapping_content_harsimran_v1.2.pdf   requirements.txt





### EMAIL TESTING WITH GOOGLE GMAIL API ]


# SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
# # authentication setup and generating token.json
# def gmail_authenticate():
#     creds = None
#     if os.path.exists("token.json"):
#         creds = Credentials.from_authorized_user_file("token.json", SCOPES)
#     if not creds or not creds.valid:
#         if creds and creds.expired and creds.refresh_token:
#             creds.refresh(Request())
#         else:
#             flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
#             creds = flow.run_local_server(port=0)
#         with open("token.json", "w") as token:
#             token.write(creds.to_json())
#     return build("gmail", "v1", credentials=creds)

# service = gmail_authenticate()
# print("✅ Gmail API authenticated successfully!")



# def send_html_email(data : EmailRequest):
#     # Load saved credentials
#     creds = Credentials.from_authorized_user_file("token.json", SCOPES)
#     service = build("gmail", "v1", credentials=creds)

#     # Load HTML Template
#     with open("template.html", "r", encoding="utf-8") as f:
#         html_template = f.read()

#     # Inject variables into template
#     html_content = html_template.format()

#     # Create MIME message
#     message = MIMEText(html_content, "html")
#     message["to"] = data['user_name']
#     message["from"] = "support@fraterny.com"
#     message["subject"] = "Your Full AI-Psychoanalysis Report is Ready"

#     # Encode message
#     raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

#     # Send email
#     send_message = service.users().messages().send(userId="me", body={"raw": raw}).execute()
#     print(f"✅ Email sent! Message Id: {send_message['id']}")

# # Example usage
# send_html_email(
#     to_email="user@example.com",
#     subject="Your Full AI-Psychoanalysis Report is Ready",
#     template_vars={"data.pdf_link": "https://fraterny.com/reports/12345"}
# )






## SEND GRID





# 1.  Name  
# 2.  Email  
# 3.  City  
# 4.  DOB  
# 5.  Mobile Number  
# 6.  Is Anonymous  
# 7.  User Id  
# 8.  Test id  
# 9.  Device Type  
# 10. Device Browser  
# 11. Operating System  
# 12. User Question Start  
# 13. User Question Completion  
# 14. q1_1  
# 15. q1_2  
# 16. q1_3  
# 17. q1_4  
# 18. q1_5  
# 19. q2_1  
# 20. q2_2  
# 21. q2_3  
# 22. q3_1  
# 23. q3_2  
# 24. q3_3  
# 25. q3_4  
# 26. q4_3  
# 27. q4_4  
# 28. q5_1  
# 29. q5_2  
# 30. q5_3  
# 31. Free Report Generation Time  
# 32. Paid Generation Time  
# 33. URL  
# 34. Quest Paid  
# 35. User Answer Quality  

import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ["https://spreadsheets.google.com/feeds",
         "https://www.googleapis.com/auth/drive"]

creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)

# Open your spreadsheet
# spreadsheet = client.open("Quest User Data")
spreadsheet = client.open_by_url("https://docs.google.com/spreadsheets/d/1h1WRm_eobIgIokX_q15ogNCri3R0orq8W9O_YmLU1Sk/edit?gid=0#gid=0")

# Open specific sheets (tabs)
user_data_sheet = spreadsheet.worksheet("RAW DATA")
demo_sheet = spreadsheet.worksheet("Demo Testing")



import pandas as pd

@app.on_event("startup")
@repeat_every(seconds=900) # 15 minutes = 900 seconds
def fetch_and_merge(user_id: str | None = None, limit: int | None = None):
    # 1) fetch summaries
    q = supabase.from_("summary_generation").select("*")
    if user_id:
        q = q.eq("user_id", user_id)
    if limit:
        q = q.limit(limit)
    res = q.execute()
    sgs = res.data or []

    if not sgs:
        return pd.DataFrame()  # nothing

    # collect testids and user_ids
    testids = [s.get("testid") for s in sgs if s.get("testid")]
    user_ids = list({s.get("user_id") for s in sgs if s.get("user_id")})

    # 2) fetch free_feedback for those testids
    ff_map = {}
    if testids:
        ff_res = supabase.from_("free_feedback").select("*").in_("testid", testids).execute()
        ff_rows = ff_res.data or []
        # pick latest feedback per testid (by time)
        for row in ff_rows:
            t = row.get("testid")
            if not t: continue
            prev = ff_map.get(t)
            if prev is None or (row.get("time") or "") > (prev.get("time") or ""):
                ff_map[t] = row

    # 3) fetch transaction_details for those testids
    td_map = {}
    if testids:
        td_res = supabase.from_("transaction_details").select("*").in_("testid", testids).execute()
        td_rows = td_res.data or []
        for row in td_rows:
            t = row.get("testid")
            if not t: continue
            prev = td_map.get(t)
            # prefer payment_completed_time descending (latest completed)
            if prev is None:
                td_map[t] = row
            else:
                a = row.get("payment_completed_time") or ""
                b = prev.get("payment_completed_time") or ""
                if a > b:
                    td_map[t] = row

    # 4) fetch user_data for those user_ids
    user_map = {}
    if user_ids:
        u_res = supabase.from_("user_data").select("*").in_("user_id", user_ids).execute()
        for u in (u_res.data or []):
            user_map[u.get("user_id")] = u


    # fetch from summary_question_answer the each quetion answer
    sg_map = {}
    if user_ids:
        s_res = supabase.from_("summary_question_answer").select("*").in_("user_id", user_ids).execute()
        for u in (s_res.data or []):
            sg_map[u.get("testid")] = u
   # print(f"Here summary ageneretion {sg_map}")
    # 5) merge into rows (one row per summary_generation)
    rows = []
    for sg in sgs:
        testid = sg.get("testid")
        u = user_map.get(sg.get("user_id"), {})
        ff = ff_map.get(testid, {})
        td = td_map.get(testid, {})
        sm = sg_map.get(testid, {})
        merged = {}
        # user_data columns
        merged.update({
            "user_name": u.get("user_name"),
            "email": u.get("email"),
            "city": u.get("city"),
            "dob": u.get("dob"),
            "mobile_number": u.get("mobile_number"),
            "is_anonymous": u.get("is_anonymous"),
            "user_id": u.get("user_id") or sg.get("user_id"),
        })
        # summary columns
        merged.update({
            "testid": sg.get("testid"),
            "device_type": sg.get("device_type"),
            "device_browser": sg.get("device_browser"),
            "operating_system": sg.get("operating_system"),
            "starting_time": sg.get("starting_time"),
            "completion_time": sg.get("completion_time"),
            # q1..q5
            "q1_1": sg.get("q1_1"), "q1_2": sg.get("q1_2"), "q1_3": sg.get("q1_3"),
            "q1_4": sg.get("q1_4"), "q1_5": sg.get("q1_5"),
            "q2_1": sg.get("q2_1"), "q2_2": sg.get("q2_2"), "q2_3": sg.get("q2_3"),
            "q3_1": sg.get("q3_1"), "q3_2": sg.get("q3_2"), "q3_3": sg.get("q3_3"),
            "q3_4": sg.get("q3_4"), "q3_5": sg.get("q3_5"), "q3_6": sg.get("q3_6"),
            "q4_1": sg.get("q4_1"), "q4_2": sg.get("q4_2"), "q4_3": sg.get("q4_3"),
            "q4_4": sg.get("q4_4"),
            "q5_1": sg.get("q5_1"), "q5_2": sg.get("q5_2"), "q5_3": sg.get("q5_3"),
                "name":sm.get("name"),
            "email":sm.get("email"),
            "age":sm.get("age"),
            "gender":sm.get("gender"),
            "lived_most_in_city":sm.get("lived_most_in_city"),
            "city":sm.get("city"),
            "grow_up_with":sm.get("grow_up_with"),
            "childhood_different":sm.get("childhood_different"),
            "family_fight":sm.get("family_fight"),
            "highest_priority_goal":sm.get("highest_priority_goal"),
            "what_matters":sm.get("what_matters"),
            "magically_3_things":sm.get("magically_3_things"),
            "understand_better_than":sm.get("understand_better_than"),
            "best_in_the_world":sm.get("best_in_the_world"),
            "inspires_you":sm.get("inspires_you"),
            "bad_habbit_other_say":sm.get("bad_habbit_other_say"),
            "you_do_regularly":sm.get("you_do_regularly"),
            "emotion_find_hard_to_show":sm.get("emotion_find_hard_to_show"),
            "you_proou_yourself":sm.get("you_proou_yourself"),
            "close_friends_describe_you":sm.get("close_friends_describe_you"),
            "describe_personality":sm.get("describe_personality"),
            "you_wish_people_understand":sm.get("you_wish_people_understand"),
            "url": sg.get("url"),
            "gender": u.get("gender"),
            "agent_completion_time": sg.get("agent_completion_time"),
            "status": sg.get("status"),
            "summary_error": sg.get("summary_error"),
            "qualityscore": sg.get("qualityscore"),
            "AQI": sg.get("AQI"),
        })
        

        #print(f"Here is get result {dicts}")

        # free feedback fields (mapped)
        merged.update({
            "free_time": ff.get("time"),
            "free_emotional": ff.get("emotional"),
            "free_emotional_react": ff.get("emotional_react"),
            "free_mind": ff.get("mind"),
            "free_mind_react": ff.get("mind_react"),
            "free_findings": ff.get("findings"),
            "free_findings_react": ff.get("findings_react"),
            "free_quotes": ff.get("quotes"),
            "free_quotes_react": ff.get("quotes_react"),
            "free_films": ff.get("films"),
            "free_films_react": ff.get("films_react"),
            "free_subjects": ff.get("subjects"),
            "free_subjects_react": ff.get("subjects_react"),
            "free_astrology": ff.get("astrology"),
            "free_astrology_react": ff.get("astrology_react"),
            "free_books": ff.get("books"),
            "free_books_react": ff.get("books_react"),
            "free_action_time": ff.get("work"),
            "free_action_react": ff.get("work_react"),
        })  
        # transaction fields
        merged.update({
            "payment_id": td.get("payment_id"),
            "order_id": td.get("order_id"),
            "txn_status": td.get("status"),
            "total_paid": td.get("total_paid"),
            "txn_start_time": td.get("session_start_time"),
            "txn_complete_time": td.get("payment_completed_time"),
        })
        # extra summary fields
        merged.update({
            "paid_agent_start_time": sg.get("paid_agent_start_time"),
            "paid_agent_complete_time": sg.get("paid_agent_complete_time"),
            "quest_status": sg.get("quest_status"),
            "quest_error": sg.get("quest_error"),
            "quest_pdf": sg.get("quest_pdf"),
        })

        rows.append(merged)

    headers = [
        "user_name", "email", "city", "dob", "mobile_number", "is_anonymous", "user_id",
        "testid", "device_type", "device_browser", "operating_system", "starting_time",
        "completion_time", "q1_1", "q1_2", "q1_3", "q1_4", "q1_5", "q2_1", "q2_2", "q2_3",
        "q3_1", "q3_2", "q3_3", "q3_4", "q3_5", "q3_6", "q4_1", "q4_2", "q4_3", "q4_4",
        "q5_1", "q5_2", "q5_3",
            "name",
            "email",
            "age",
            "gender",
            "lived_most_in_city",
            "city",
            "grow_up_with",
            "childhood_different",
            "family_fight",
            "highest_priority_goal",
            "what_matters",
            "magically_3_things",
            "understand_better_than",
            "best_in_the_world",
            "inspires_you",
            "bad_habbit_other_say",
            "you_do_regularly",
            "emotion_find_hard_to_show",
            "you_proou_yourself",
            "close_friends_describe_you",
            "describe_personality",
            "you_wish_people_understand",
         "total_time_taken_by_agent", "paid_generation_time", "url",
        "gender", "agent_completion_time", "status", "summary_error", "qualityscore", "AQI",
        "free_time", "free_emotional", "free_emotional_react", "free_mind", "free_mind_react",
        "free_findings", "free_findings_react", "free_quotes", "free_quotes_react", "free_films",
        "free_films_react", "free_subjects", "free_subjects_react", "free_astrology",
        "free_astrology_react", "free_books", "free_books_react", "free_action_time",
        "free_action_react", "payment_id", "order_id", "txn_status", "total_paid",
        "txn_start_time", "txn_complete_time", "paid_agent_start_time",
        "paid_agent_complete_time", "quest_status", "quest_error", "quest_pdf"
    ]
    sheet_data = [headers]
    
    # Iterate through each dictionary and create a list of values in the correct order
    for row_dict in rows:
        # Using .get(header, "") ensures that if a key is missing, it inserts an empty string
        row_list = [row_dict.get(h, "") for h in headers]
        sheet_data.append(row_list)
    print(f"Type of row is {type(rows)}") 
    print(f"length of row is {len(rows)}")   
    # df = pd.DataFrame(rows)
    #print(sheet_data)
    # enforce column order requested (drop missing columns gracefully)
    
    return update_entire_sheet(data=sheet_data)


demo_sheet = spreadsheet.worksheet("Demo Testing")

def update_entire_sheet( data: list):
    """
    Clears the entire Google Sheet and updates it with new data.

    Args:
        sheet_object: The gspread worksheet object to update.
        data (list): A list of lists, where each inner list is a row.
    """
    try:
        # Step 1: Clear the entire sheet
        print("Clearing the sheet...")
        demo_sheet.clear()
        print("Sheet cleared.")
        print(f"list of rows {type(data)}")
        print(f"length of rows {len(data)}")
        # Step 2: Update the sheet with the new data
        print("Updating sheet with new data...")
        demo_sheet.update(values=data, range_name='A1') # Writing data starting from cell A1
        print("Sheet updated successfully!")
        return "Sheet updated successfully!"

    except Exception as e:
        return f"Failed to update sheet due to: {e}"



def user_data_sheet_append(data:list):
    try:
        print(type(data))
        print(user_data_sheet.append_row(values=data,value_input_option="RAW"))
    except Exception as e:
        return f"Failed to append data due to {e}"
# Failed to update data due to 'function' object has no attribute 'get_all_values'
def user_datasheet(data:list):
    try:
        print(f"Inside user data sheet that works for appending")
        next_row = len(user_data_sheet.get_all_values()) + 1
        print(f"Row will insreterr {next_row}")
        next_row = f"A{next_row}:AQ{next_row}"
        print(f"Here is row {next_row}")
        print(user_data_sheet.update(next_row,[data]))
    except Exception as e:
        return f"Failed to update data due to {e}"
   

def user_data_sheet_update(data:list,testid:str):
    try:
        cell = read_sheet(testid,sheet="RAW DATA")
        row = cell.row 
        print(f"Here is row {row}")
        print(f"Data type in update {type(data)}")
        col = cell.col 
        row = f"A{row}:AQ{row}"
        print(f"Here is row {row}")
        user_data_sheet.update(row,[data])
    except Exception as e:
        print(f"Failed to update due to {e}")
        return {"status":"failed","message":f"Failed to update due to {e}"}

 

def user_data_sheet_2update(data:list,testid:str):
    try:
        cell = read_sheet(testid,sheet="RAW DATA")
        row = cell.row 
        print(f"Here is row {row}")
        print(f"Data type in update {type(data)}")
        col = cell.col 
        row = f"A{row}:AQ{row}"
        print(f"Here is row {row}")
        user_data_sheet.update(row,data)
    except Exception as e:
        return f"Failed to update data due to {e}"


    
    
def user_data_cell_update(data:str,testid:str,col:int):
    try:
        cell = read_sheet(testid,sheet="RAW DATA")
        row = cell.row 
        #col = cell.col 
        #row = f"A{row}:AP{row}"
        user_data_sheet.update_cell(row=row,col=col,value=data)
    except Exception as e:
        return f"Failed to update data due to {e}"


def read_sheet(testid:str,sheet:str):
    try:
        user_data_sheet = spreadsheet.worksheet("RAW DATA")
        print(f"Here is sheet {sheet} and testid {testid}")
        print(user_data_sheet.find(testid))
        return user_data_sheet.find(testid)
    except Exception as e:
        return f"Failed to read due to {e}"
   
    

def feedback_sheet_update(data:list,testid:str,col:int):
    try:
        cell = read_sheet(testid,sheet="RAW DATA")
        print(f"here is cell {cell}")
        row = cell.row 
        print(f"here is cell row {row}")
        print(f"here is cell col {col}")
        #col = cell.col 
        #row = f"A{row}:AP{row}"
        print(f"heer is data {data}")
        user_data_sheet.update_cell(row=row,col=col,value=data[0])
    except Exception as e:
        return f"Failed to update data due to {e}"

def transactions_sheet_append(data:list,testid:str):
    try:
        print(f"Here insiside transactio data {data}")
        cell = read_sheet(testid,sheet="RAW DATA")
        print(f"here is cell {cell}")
        row = cell.row 
        print(f"Here is row {row}")
        print(f"Data type in update {type(data)}")
        col = 55 
        row = f"BL{row}:BR{row}"
        print(f"Here is row {row}")
        user_data_sheet.update(row,[data])
    except Exception as e:
        return f"Failed to update data due to {e}"


def paid_agent_sheet_update(data:list,testid:str):
    try:
        cell = read_sheet(testid,sheet="RAW DATA")
        row = cell.row 
        print(f"Here is row {row}")
        print(f"Data type in update {type(data)}")
        col = 55 
        row = f"BS{row}:BW{row}"
        print(f"Here is row {row}")
        user_data_sheet.update(row,[data])
    except Exception as e:
        return f"Failed to update data due to {e}"

def paid_agent_cell_update(data:list,col:int,testid:str):
    try:
        print(f"inside paid agent cell update testid {testid}")
        cell = read_sheet(testid,sheet="feedback")
        row = cell.row 
        #col = cell.col 
        #row = f"A{row}:AP{row}"
        user_data_sheet.update_cell(row=row,col=col,value=[data])
    except Exception as e:
        return f"Failed to update data due to {e}"

    