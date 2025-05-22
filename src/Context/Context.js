import { createClient } from "@supabase/supabase-js";


const PROJECT_URL ="https://mpayrxfffhwlhsrhuckr.supabase.co";	
const PUBLIC_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wYXlyeGZmZmh3bGhzcmh1Y2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTE1OTksImV4cCI6MjA2MjEyNzU5OX0.xrT4DAzQuz9_AnkqjLR-_O4ASgwULP9vWaxrKC8EQWo";

export const supabase = createClient(PROJECT_URL, PUBLIC_KEY);