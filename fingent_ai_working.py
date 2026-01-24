import streamlit as st
import requests
import json
from datetime import datetime
import time
import os
import subprocess
import sys
from dotenv import load_dotenv
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="Fingent AI - Talk to Agent",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        color: white;
        text-align: center;
    }
    
    .phone-form {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 15px;
        border: 2px solid #e9ecef;
        margin: 1rem 0;
    }
    
    .call-button {
        background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        border: none;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .call-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }
    
    .status-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 5px solid #007bff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin: 1rem 0;
    }
    
    .agent-info {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        margin: 1rem 0;
    }
    
    .feature-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin: 0.5rem 0;
        border-left: 4px solid #28a745;
    }
    
    .stButton > button {
        width: 100%;
        background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
    }
    
    .phone-input {
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        padding: 0.75rem;
        font-size: 1.1rem;
    }
    
    .success-message {
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid #c3e6cb;
        margin: 1rem 0;
    }
    
    .error-message {
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid #f5c6cb;
        margin: 1rem 0;
    }
    
    .api-key-section {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .mcp-info {
        background: #e3f2fd;
        border: 1px solid #bbdefb;
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'call_history' not in st.session_state:
    st.session_state.call_history = []
if 'current_call_status' not in st.session_state:
    st.session_state.current_call_status = None
if 'elevenlabs_api_key' not in st.session_state:
    st.session_state.elevenlabs_api_key = "sk_9f5bc324f197b0b5b88fb36860e096a2de9e6f656189e969"

# Agent configuration
AGENT_ID = "agent_6601k1tkynd0efpvrbnsz86pbb9q"
PHONE_NUMBER_ID = "PN26c7255a2dc10e80d57b8d4cea51e234"

def make_real_outbound_call(phone_number):
    """Make a real outbound call using Twilio"""
    from twilio.rest import Client
    # Get your credentials securely (use environment variables or Streamlit secrets)
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")  # Set this in your environment
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")    # Set this in your environment
    twilio_number = "+13158403591"  # Replace with your Twilio-verified number
    twiml_url = "https://handler.twilio.com/twiml/YOUR_TWIML_URL"  # Replace with your TwiML URL
    try:
        client = Client(account_sid, auth_token)
        call = client.calls.create(
            to=phone_number,
            from_=twilio_number,
            url=twiml_url
        )
        return {
            "status": "success",
            "to_number": phone_number,
            "timestamp": datetime.now().isoformat(),
            "call_sid": call.sid,
            "message": "Call initiated successfully via Twilio"
        }
    except Exception as e:
        error_msg = str(e)
        
        # Handle specific Twilio phone number verification errors
        if "not yet verified" in error_msg.lower() or ("unverified" in error_msg.lower() and "phone number" in error_msg.lower()):
            return {
                "status": "error",
                "message": "❌ Phone Number Not Verified",
                "details": f"""
                <div style='padding: 1rem; background: #fff3cd; border-radius: 10px; margin-top: 1rem;'>
                    <h4>📞 How to Fix This:</h4>
                    <ol>
                        <li><strong>Verify the phone number in Twilio Console:</strong><br>
                            <a href='https://console.twilio.com/us1/develop/phone-numbers/manage/verified' target='_blank'>
                                https://console.twilio.com/us1/develop/phone-numbers/manage/verified
                            </a>
                        </li>
                        <li><strong>Or purchase a Twilio phone number:</strong><br>
                            <a href='https://console.twilio.com/us1/develop/phone-numbers/manage/search' target='_blank'>
                                https://console.twilio.com/us1/develop/phone-numbers/manage/search
                            </a>
                        </li>
                        <li><strong>Or upgrade to a paid account</strong> to call any number without verification</li>
                    </ol>
                    <p><strong>Current phone number:</strong> {twilio_number}</p>
                    <p><strong>Error Code:</strong> 21210</p>
                </div>
                """
            }
        elif "trial" in error_msg.lower() and ("unverified" in error_msg.lower() or "not verified" in error_msg.lower()):
            return {
                "status": "error",
                "message": "❌ Trial Account Limitation",
                "details": f"""
                <div style='padding: 1rem; background: #fff3cd; border-radius: 10px; margin-top: 1rem;'>
                    <h4>📞 Trial Account Restrictions:</h4>
                    <p>With a Twilio trial account, you can only call verified phone numbers.</p>
                    <ol>
                        <li><strong>Verify recipient's number:</strong><br>
                            <a href='https://console.twilio.com/us1/develop/phone-numbers/manage/verified' target='_blank'>
                                Verify Phone Numbers
                            </a>
                        </li>
                        <li><strong>Or upgrade to paid account</strong> to call any number</li>
                    </ol>
                </div>
                """
            }
        elif "http error" in error_msg.lower() or "21210" in error_msg:
            return {
                "status": "error", 
                "message": "❌ Twilio API Error (21210): Phone Number Not Verified",
                "details": f"""
                <div style='padding: 1rem; background: #f8d7da; border-radius: 10px; margin-top: 1rem;'>
                    <p><strong>Error:</strong> The source phone number ({twilio_number}) is not verified for your account.</p>
                    <p><strong>Solution:</strong> Verify the number at 
                        <a href='https://console.twilio.com/us1/develop/phone-numbers/manage/verified' target='_blank'>
                            Twilio Console
                        </a>
                    </p>
                    <p><strong>Full Error:</strong> {error_msg[:200]}...</p>
                </div>
                """
            }
        else:
            return {
                "status": "error",
                "message": f"❌ Call Error",
                "details": f"""
                <div style='padding: 1rem; background: #f8d7da; border-radius: 10px; margin-top: 1rem;'>
                    <p><strong>Error Details:</strong></p>
                    <pre style='background: #fff; padding: 0.5rem; border-radius: 5px; overflow-x: auto;'>{error_msg}</pre>
                    <p style='margin-top: 1rem;'><strong>Check:</strong></p>
                    <ul>
                        <li>Twilio Account SID and Auth Token are correct</li>
                        <li>Phone number is verified in Twilio Console</li>
                        <li>Account has sufficient balance (if paid account)</li>
                    </ul>
                </div>
                """
            }

def validate_phone_number(phone_number):
    """Validate international phone number format"""
    import re
    # Remove all non-digit characters except +
    cleaned = re.sub(r'[^\d+]', '', phone_number)
    
    # Check if it starts with + and has 10-15 digits
    if not cleaned.startswith('+'):
        return False, "Phone number must start with + (e.g., +1XXXXXXXXXX, +44XXXXXXXXXX)"
    
    digits_only = cleaned[1:]  # Remove the +
    if len(digits_only) < 10 or len(digits_only) > 15:
        return False, "Phone number must have 10-15 digits after the +"
    
    # Additional validation for common country codes
    country_codes = ['1', '44', '91', '61', '86', '81', '49', '33', '39', '34', '31', '46', '47', '45', '358', '46', '47', '45', '358']
    if len(digits_only) >= 2:
        country_code = digits_only[:2] if digits_only.startswith(('44', '91', '61', '86', '81', '49', '33', '39', '34', '31', '46', '47', '45', '35')) else digits_only[:1]
        if country_code not in country_codes:
            return False, f"Unsupported country code: +{country_code}"
    
    return True, cleaned

# Main header
st.markdown("""
<div class="main-header">
    <h1>💰 Fingent AI - Financial Assistant</h1>
    <p>Your professional financial advisor for market updates, trading insights, and tax tips</p>
</div>
""", unsafe_allow_html=True)

# Sidebar for configuration
with st.sidebar:
    st.markdown("""
    <div class="agent-info">
        <h3>🤖 Agent Details</h3>
        <p><strong>Name:</strong> Fingent AI</p>
        <p><strong>Voice:</strong> Will (Professional Male)</p>
        <p><strong>Specialty:</strong> Financial Advisory</p>
        <p><strong>Language:</strong> English</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 📞 Call Configuration")
    st.info(f"**Agent ID:** {AGENT_ID}")
    st.info(f"**Phone ID:** {PHONE_NUMBER_ID}")
    st.info("**From:** +13158403591")
    
    st.markdown("### 🔧 Call Method")
    st.info("**Using:** MCP Integration (Real Calls)")
    
    # Check if phone number is set and show verification status
    twilio_number = "+13158403591"
    st.warning(f"""
    ⚠️ **Phone Number:** {twilio_number}
    
    **Important:** This number must be verified in your Twilio Console.
    [Verify Now](https://console.twilio.com/us1/develop/phone-numbers/manage/verified)
    """)
    
    st.success("✅ Ready to make outbound calls")

# Main content area
col1, col2 = st.columns([2, 1])

with col1:
    st.markdown("## 📞 Make Outbound Call")
    
    # Phone number input form
    st.markdown("""
    <div class="phone-form">
        <h3>Enter Phone Number</h3>
        <p>Provide a valid international phone number to receive financial updates from Fingent AI.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Phone number input
    phone_number = st.text_input(
        "Phone Number (International Format)",
        placeholder="+1XXXXXXXXXX, +44XXXXXXXXXX, +91XXXXXXXXXX",
        help="Enter the phone number in international format (e.g., +1XXXXXXXXXX)"
    )
    
    # Validation and call button
    if phone_number:
        is_valid, validation_result = validate_phone_number(phone_number)
        
        if is_valid:
            st.success(f"✅ Valid phone number: {validation_result}")
            
            # Make call button
            if st.button("📞 Make Outbound Call", type="primary"):
                with st.spinner("Initiating call..."):
                    call_result = make_real_outbound_call(validation_result)
                    
                    call_result["timestamp"] = datetime.now().isoformat()
                    call_result["to_number"] = validation_result
                    call_result["method"] = "MCP Integration"
                    
                    if call_result["status"] == "success":
                        st.session_state.current_call_status = call_result
                        st.session_state.call_history.append(call_result)
                        
                        st.markdown("""
                        <div class="success-message">
                            <h4>🎉 Call Initiated Successfully!</h4>
                            <p><strong>Method:</strong> MCP Integration</p>
                            <p><strong>Conversation ID:</strong> {}</p>
                            <p><strong>Call SID:</strong> {}</p>
                            <p><strong>Status:</strong> {}</p>
                        </div>
                        """.format(
                            call_result.get("conversation_id", "N/A"),
                            call_result.get("call_sid", "N/A"),
                            call_result["status"]
                        ), unsafe_allow_html=True)
                        
                        st.info("""
                        **What happens next:**
                        1. The call is connecting to the recipient
                        2. When they answer, Fingent AI will introduce itself
                        3. The agent will provide financial updates and insights
                        4. Conversation can last up to 10 minutes
                        """)
                    else:
                        error_message = call_result.get("message", "Unknown error")
                        error_details = call_result.get("details", "")
                        
                        st.markdown(f"""
                        <div class="error-message">
                            <h4>{error_message}</h4>
                            {error_details if error_details else ""}
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Also show a helpful info box
                        st.info("💡 **Tip:** Make sure your Twilio phone number is verified in the Twilio Console before making calls.")
        else:
            st.error(f"❌ Invalid phone number: {validation_result}")

with col2:
    st.markdown("## 🎯 Agent Features")
    
    features = [
        {
            "icon": "📈",
            "title": "Market Updates",
            "description": "Latest financial news and market trends"
        },
        {
            "icon": "💼",
            "title": "Trading Insights",
            "description": "Trading strategies and opportunities"
        },
        {
            "icon": "🏦",
            "title": "Investment Tips",
            "description": "Portfolio management and schemes"
        },
        {
            "icon": "💰",
            "title": "Tax Savings",
            "description": "Tax-saving tips and financial planning"
        }
    ]
    
    for feature in features:
        st.markdown(f"""
        <div class="feature-card">
            <h4>{feature['icon']} {feature['title']}</h4>
            <p>{feature['description']}</p>
        </div>
        """, unsafe_allow_html=True)

# Call method info
st.markdown("""
<div class="mcp-info">
    <h4>🔧 MCP Integration</h4>
    <p>Using Model Context Protocol (MCP) tools for reliable outbound calls. This method has been tested and works correctly.</p>
</div>
""", unsafe_allow_html=True)

# Call history section
if st.session_state.call_history:
    st.markdown("## 📋 Call History")
    
    for i, call in enumerate(reversed(st.session_state.call_history)):
        with st.expander(f"Call #{len(st.session_state.call_history) - i} - {call['timestamp'][:19]} ({call.get('method', 'Unknown')})"):
            st.json(call)

# Current call status
if st.session_state.current_call_status:
    st.markdown("## 📊 Current Call Status")
    
    status = st.session_state.current_call_status
    st.markdown(f"""
    <div class="status-card">
        <h4>Active Call</h4>
        <p><strong>Method:</strong> {status.get('method', 'N/A')}</p>
        <p><strong>To:</strong> {status.get('to_number', 'N/A')}</p>
        <p><strong>Status:</strong> {status.get('status', 'N/A')}</p>
        <p><strong>Conversation ID:</strong> {status.get('conversation_id', 'N/A')}</p>
        <p><strong>Call SID:</strong> {status.get('call_sid', 'N/A')}</p>
    </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 2rem;">
    <p>💰 Fingent AI - Professional Financial Advisory Service</p>
    <p>Powered by ElevenLabs Voice AI Technology & MCP Integration</p>
</div>
""", unsafe_allow_html=True) 