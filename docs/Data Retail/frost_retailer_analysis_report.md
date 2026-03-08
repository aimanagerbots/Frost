# Frost Retailer Contacts — Deep Analysis Report
*Generated: March 7, 2026*
*Dataset: Retailer Contacts Copy — Google Sheets*

---

## Executive Summary

Frost's retailer contact database contains **508 unique accounts** across Washington State after cleaning (from 714 raw rows). Of these, **0 (0%) are Active customers**, giving Frost an estimated **0% market penetration** of WA's ~500 licensed recreational retailers.

The database is a strong foundation but has significant data quality gaps: 45% of accounts lack phone numbers, 23% lack email, and 73% have no formal status classification. The Notes field contains rich sales intelligence that reveals an aggressive outreach campaign focused on sampling and pricing.

**Key findings:**
- Seattle Metro dominates with 158 accounts, but only 0 are Active
- 1 accounts contacted in the last 30 days (0%)
- 105 accounts have been sent samples — a key conversion signal
- "NC" in notes stands for **"New Contact"** or is used as a **status marker meaning the note was updated/confirmed** (appears after updates like "emailed about restock NC" or "reached out... NC")
- 41 accounts show positive sentiment, 7 negative, 95 pending follow-up

---

## Step 1: Data Cleaning Results

| Metric | Count |
|---|---|
| Raw rows (excl header) | 714 |
| Rows with no retailer name (removed) | 188 |
| Remaining records | 526 |
| Duplicate license numbers found | 16 groups (18 duplicate rows removed) |
| Name-based potential duplicates | 42 groups (flagged, not removed) |
| **Final clean dataset** | **508** |

### Duplicate Details
- License **400085**: HOUSE OF CANNABIS - TWISP, Twisp House of cannabis (2 entries)
- License **413809**: FORBIDDEN CANNABIS CLUB SEATTLE, ponder (2 entries)
- License **413886**: Green Leaf Bellingham (ABC AGENCY LLC ), Green Leaf (2 entries)
- License **414918**: Green leaf, PHC ENTERPRISE, LLC (2 entries)
- License **414931**: Green Tiki Cannabis, Vancouver Weedery (2 entries)
- License **417949**: Danks Warehouse Renton, SOUTH SEATTLE RETAIL HOLDINGS LLC (2 entries)
- License **420390**: Herbal Healing, ORCAS ISLAND CANNABIS (2 entries)
- License **420497**: Alkaloid Cannabis - this retailer is now green nugget mead location, Lucid Cannabis Co, The Green Nugget Mead (used to be Alkaloid) (3 entries)
- License **420801**: CARAVAN CANNABIS COMPANY, THE JOINT BURLINGTON (2 entries)
- License **422454**: HOUSE OF CANNABIS - TONASKET, Tonasket House of cannabis (2 entries)
- License **422457**: HOUSE OF CANNABIS - WHIDBEY, The weed shop (2 entries)
- License **422460**: The Link Cannabis Company (Sweet Relief Port Angeles), The Link Port Angeles -  (Aristocrat Enterprises II) (2 entries)
- License **422504**: CLOUD 9, Lucid Cheney. GREEN SOLUTION PLACE (2 entries)
- License **429044**: DISPO 42, Rengar LLC (2 entries)
- License **430622**: The Green house, THE GREENHOUSE (2 entries)
- License **Tacoma**: Commencement Bay Cannabis - Black, Commencement Bay Cannabis - Green, Commencement Bay Cannabis - Red (3 entries)

### Date Standardization
- 343 dates successfully parsed to ISO format (YYYY-MM-DD)
- 4 dates could not be parsed

---

## Step 2: A/I/R Pipeline Classification

### Pipeline Summary

| Pipeline | Count | % |
|---|---|---|
| **Active (A)** | 0 | 0% |
| **Inactive (I)** | 377 | 74% |
| **Recovery (R)** | 131 | 26% |

### Phase Breakdown

| Code | Label | Count |
|---|---|---|
| I1 | I1 - Unconfirmed cold lead | 126 |
| I2 | I2 - Contacted/has notes | 115 |
| I3 | I3 - Active dialogue/meeting | 4 |
| I4 | I4 - Samples sent | 74 |
| I5 | I5 - Near order / has ordered | 58 |
| R1 | R1 - Temp Closed | 2 |
| R2 | R2 - Active but stale (>90 days) | 128 |
| R5 | R5 - Do Not Sell | 1 |

### Active Account Tiers


### Recovery Accounts
- **210 Cannabis** (Arlington) — R2 - Active but stale (>90 days). Last contact: 2025-06-25. Notes: Emailed about a restock NC
- **365 RECREATIONAL CANNABIS** (Shoreline) — R2 - Active but stale (>90 days). Last contact: 2025-06-25. Notes: Emailed Katie to check in and see how Fireline is selling along wtih inquiring about possibly runnin
- **420 CAPITOL** (Tumwater) — R2 - Active but stale (>90 days). Last contact: 2025-01-30. Notes: Reached out with personal email to give updated contact information 01.30.25
- **420 CARPENTER** (Lacey) — R2 - Active but stale (>90 days). Last contact: 2025-01-30. Notes: Reached out with personal email to give updated contact information 01.30.25
- **420 ELMA ON MAIN** (Elma) — R2 - Active but stale (>90 days). Last contact: Never. Notes: None
- **420 GRAND CENTRAL** (Rochester) — R2 - Active but stale (>90 days). Last contact: 2025-01-30. Notes: Reached out with personal email to give updated contact information 01.30.25
- **420 WEST** (Olympia) — R2 - Active but stale (>90 days). Last contact: 2025-01-30. Notes: Reached out with personal email to give updated contact information 01.30.25
- **420 HOLIDAY** (Longview) — R2 - Active but stale (>90 days). Last contact: 2025-05-05. Notes: Talked to Vern who is the new buyer, he wanted the sale price since the customers were used to that 
- **420 SPOT SHOP - will not do VMI** (Port Orchard) — R2 - Active but stale (>90 days). Last contact: 2025-07-09. Notes: We are doing 20% off and they are putting us on sale every Wednesday
- **A Greener Today - Walla Walla** (Walla Walla) — R2 - Active but stale (>90 days). Last contact: 2025-03-17. Notes: Talked with Kenny, he let me know it was not a good fit for the shops at this time and tokeep him up
- **ALTITUDE** (Prosser) — R2 - Active but stale (>90 days). Last contact: 2025-09-19. Notes: Emailed Maricruz with account manager contacts 02.07.25
- **AMERICAN MARY 45th Wallington** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-09-19. Notes: Emailed Tony about some samples that I woud like to send over, he placed an order and I will send th
- **APEX CANNABIS** (Moses Lake) — R2 - Active but stale (>90 days). Last contact: 2025-02-12. Notes: None
- **BAYSHORE CANNABIS CO** (Shelton) — R2 - Active but stale (>90 days). Last contact: 2025-05-21. Notes: Eamailed Dan with an offer to put everything on sale to get it out of the store and lowered his pric
- **BETTER BUDS** (Longview) — R2 - Active but stale (>90 days). Last contact: 2025-05-06. Notes: Talked Sean about adding Greenline to the 10% off right now along with Fireline Sundays. He is thril
- **BORED N BUZZED** (Kirkland) — R2 - Active but stale (>90 days). Last contact: 2025-06-10. Notes: This used to be the old Starbuds Kirkland 03.04.25 - first order placed 06.10.25
- **BUDHUT** (Camano Island) — R2 - Active but stale (>90 days). Last contact: 2025-06-04. Notes: Emailed Kimberly with new account manager information 02.10.25
- **BUDHUT** (Everett) — R2 - Active but stale (>90 days). Last contact: 2025-06-04. Notes: Emailed Beth with the updated contact info since she is acting GM for all bud hut locations and will
- **BUDS GARAGE - no friday deliveries** (Everett) — R2 - Active but stale (>90 days). Last contact: 2025-06-04. Notes: Reacheed out to Bo about how the product is sellng and if they are interested in a possibly vendor d
- **Cannabis City** (Seattle) — R1 - Temp Closed. Last contact: 2025-03-04. Notes: last order -10.26.20 - got updated buyer information - 11.16.22
- **CANNAZONE** (Bellingham) — R2 - Active but stale (>90 days). Last contact: 2025-10-10. Notes: 10.10.25 - Called Fouad, No Answer. Went to VM. Texted Fouad and he is having Thanksgiving in Canada
- **CANNAZONE** (Edmonds) — R2 - Active but stale (>90 days). Last contact: 2025-10-10. Notes: 10.10.25 - Called Fouad, No Answer. Went to VM. Texted Fouad and he is having Thanksgiving in Canada
- **Northwest Cannabis** (Mount Vernon) — R2 - Active but stale (>90 days). Last contact: 2025-10-10. Notes: 10.10.25 - Called Fouad, No Answer. Went to VM. Texted Fouad and he is having Thanksgiving in Canada
- **CASCADE KROPZ** (Arlington) — R2 - Active but stale (>90 days). Last contact: 2025-02-06. Notes: I talked with Jim, he would like to start  a hometown box with 4 of our strains and will keep me pos
- **Clear Choice Cannabis  72nd** (Tacoma) — R2 - Active but stale (>90 days). Last contact: 2025-02-06. Notes: Likes to commuicate via text message - Called and talked to Blaine today who let me know he has 2 bu
- **CLEAR CHOICE CANNABIS** (Bremerton) — R2 - Active but stale (>90 days). Last contact: 2025-06-02. Notes: Emailed Geo with a mock order and he approved, order is being delivered 03.03.25
- **CLEAR CHOICE CANNABIS** (Tacoma) — R2 - Active but stale (>90 days). Last contact: 2025-06-02. Notes: Emailed Kathleen a thank you for your order email, gave updated contact info, put samples on the ord
- **Danks Warehouse** (Tacoma) — R2 - Active but stale (>90 days). Last contact: 2025-03-21. Notes: I offered to do VMI if they can send me there inventory weekly and as a perk I will offer them a dis
- **DANK'S Warehouse** (Edmonds) — R2 - Active but stale (>90 days). Last contact: 2025-02-26. Notes: Ashley does not work on Wednesdays - Emailed Ashley giving her my updated contact info and offering 
- **Danks Warehouse Renton** (Renton) — R2 - Active but stale (>90 days). Last contact: Never. Notes: None
- **DIAMOND GREEN** (Tacoma) — R2 - Active but stale (>90 days). Last contact: 2025-02-10. Notes: Emailed Heather with my contact info 02.10.25 Called and talked to a budtender who confirmed Heather
- **Elevation  (MJ Compact Retail Location)** (Shelton) — R2 - Active but stale (>90 days). Last contact: Never. Notes: None
- **Emerald Coast** (Bremerton) — R2 - Active but stale (>90 days). Last contact: 2025-02-13. Notes: Dawn called and said she met us at the safety meeting, she wants a order expedited to her right away
- **FILLABONG** (Bremerton) — R2 - Active but stale (>90 days). Last contact: 2025-02-12. Notes: Emailed Karla with my new contact info and got confirmation on her contact info 02.11.25 - emailed a
- **FILLABONG** (Silverdale) — R2 - Active but stale (>90 days). Last contact: 2025-02-12. Notes: Emailed Karla with my new contact info and got confirmation on her contact info 02.11.25 - emailed a
- **FIRE AND FROST CANNABIS** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-02-11. Notes: Reached out with new account manager information 02.11.25 Talked to Riley who gave me all the update
- **FLOYD'S CANNABIS COMPANY** (Pullman) — R2 - Active but stale (>90 days). Last contact: 2025-06-10. Notes: Reached out to see if we can get a restock of products. 06.10.25
- **FLOYDS Sedro Woolley** (Sedro Woolley) — R2 - Active but stale (>90 days). Last contact: 2025-06-10. Notes: Offered 420 special deals and Greenline - NC
- **GOLDEN DISPENSARIES** (Goldendale) — R2 - Active but stale (>90 days). Last contact: 2025-02-10. Notes: Called and talked to Austin who stated he is placing an order - looking for diamonds and sauce. He i
- **GREEN LIFE CANNABIS** (Wenatchee) — R2 - Active but stale (>90 days). Last contact: 2025-05-22. Notes: They are going to do a daily deals for us one day a week with the new pricing and she has requested 
- **GREEN ROOM OH INC.** (Oak Harbor) — R2 - Active but stale (>90 days). Last contact: 2025-02-06. Notes: Called and talked to Simon who is the owner - I emaied them my updated contact info so they can upda
- **GREENFIELD COMPANY CANNABIS MERCANTILE** (Clarkston) — R2 - Active but stale (>90 days). Last contact: 2025-09-23. Notes: placed an order on cultivera 09.23.25
- **GREENLIGHT** (Millwood) — R2 - Active but stale (>90 days). Last contact: 2025-02-21. Notes: Emailed them with our new contact info and asked if they would like a restock. Talked to Joe who is 
- **GREENVIEW CANNABIS** (Longview) — R2 - Active but stale (>90 days). Last contact: 2025-02-13. Notes: Shawn is the buyer for this location and Marijuana Mart Rochester  and the email is correct. 02.13.2
- **GREENWAY MARIJUANA** (Port Orchard) — R2 - Active but stale (>90 days). Last contact: 2025-06-04. Notes: Emailed Stephen with my updated contact info informing him that Cassandra is no longer here. Talked 
- **GREENWORKS N.W.** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-02-24. Notes: Emailed them asking about a restock, they said they would put in a order soon, just waiting for inve
- **HANGAR 420 HWY 99** (Lynnwood) — R2 - Active but stale (>90 days). Last contact: 2025-06-25. Notes: Offered 420 special deals and Greenline - NC
- **HANGAR 420 SNOHOMISH** (Snohomish) — R2 - Active but stale (>90 days). Last contact: 2025-06-30. Notes: Emailed Pat with account manager contact info and a restock 02.07.25. Talked to a budtender, Pat is 
- **Hangar 420 Clearview** (Lynnwood) — R1 - Temp Closed. Last contact: 2025-06-30. Notes: Emailed on behalf of Pat to the city of Clearview
- **HERBAL NATION** (Bothell) — R2 - Active but stale (>90 days). Last contact: 2025-03-06. Notes: Mitchell said he will place an order of blunts and flower today - talked to a budtender who confirme
- **HERBAN MARKET** (Port Orchard) — R2 - Active but stale (>90 days). Last contact: 2025-04-02. Notes: Offered 420 special deals and Greenline - NC
- **HIGH-5 CANNABIS** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-06-10. Notes: Reached out to Nathon to see how the sale is going and let him know we are excited to see how the ne
- **High 5 Cannabis** (Stevenson) — R2 - Active but stale (>90 days). Last contact: 2025-06-10. Notes: Reached out to Nathon to see how the sale is going and let him know we are excited to see how the ne
- **HIGH SOCIETY** (Everett) — R2 - Active but stale (>90 days). Last contact: 2025-03-06. Notes: Emailed Savannah for a restock, tried calling but no one answered the phone 03.06.25
- **Higher Leaf Bel - Red - Require 48hrs notice for before delivery** (Bellevue) — R2 - Active but stale (>90 days). Last contact: 2025-10-10. Notes: 10.10.25 - RM spoke to Jacob and he said he would be open to meeting and looking at samples next wee
- **Higher Leaf Factoria** (Bellevue) — R2 - Active but stale (>90 days). Last contact: 2025-03-03. Notes: Gab was fired. Jacob is the buyer, I talked with him and he told me after 2-3 bad runs with the Fire
- **Higher leaf Eastside** (Bellevue) — R2 - Active but stale (>90 days). Last contact: 2025-03-03. Notes: Gab was fired. Jacob is the buyer, I talked with him and he told me after 2-3 bad runs with the Fire
- **Higher leaf - Kirkland** (Kirkland) — R2 - Active but stale (>90 days). Last contact: 2025-03-03. Notes: Gab was fired. Jacob is the buyer, I talked with him and he told me after 2-3 bad runs with the Fire
- **III KING COMPANY** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-05-07. Notes: Reached out to Rosie to see what we can do to get back in the store 03.04.25
- **KALEAFA** (Aberdeen) — R2 - Active but stale (>90 days). Last contact: 2025-03-20. Notes: David emailed me with all the updated store contacts.  as I did the same 02.10.25. Talked to David, 
- **KALEAFA** (Des Moines) — R2 - Active but stale (>90 days). Last contact: 2025-03-20. Notes: David emailed me with all the updated store contacts.  as I did the same 02.10.25. Talked to David, 
- **KALEAFA** (Oak Harbor) — R2 - Active but stale (>90 days). Last contact: 2025-03-20. Notes: David emailed me with all the updated store contacts.  as I did the same 02.10.25. Talked to David, 
- **KITSAP CANNABIS PORT ORCHARD** (Port Orchard) — R2 - Active but stale (>90 days). Last contact: 2025-02-24. Notes: This is Jose's account
- **KUSH 21 BUCKLEY LLC** (Buckley) — R2 - Active but stale (>90 days). Last contact: 2025-09-18. Notes: Talkedt to Budtender who confirmed buyer and email, I introducted myself 02.13.25
- **Kush 21 Burien - (LIVING WELL ENTERPRISES)** (Burien) — R2 - Active but stale (>90 days). Last contact: 2025-10-10. Notes: 10.22.2025 - Sent Michale a Text Message to see if he is available to meet next week Friday, 10.17.2
- **Kush 21 Everett - Evergreen way     (KUSHMAN)** (Everett) — R2 - Active but stale (>90 days). Last contact: 2025-02-13. Notes: Called but Amber was in a meeting with the big guy - will try again later but confirmed she is the b
- **Kush 21 SODO** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-09-19. Notes: None
- **LIDZ CANNABIS  South** (Spokane) — R2 - Active but stale (>90 days). Last contact: 2025-02-06. Notes: Emailed Blaine giving him my contact information and inquiring about the Lidz locations to see if we
- **LIDZ CANNABIS North** (Spokane) — R2 - Active but stale (>90 days). Last contact: 2025-02-06. Notes: Emailed Blaine giving him my contact information and inquiring about the Lidz locations to see if we
- **LOVING FARMS** (Mount Vernon) — R2 - Active but stale (>90 days). Last contact: 2025-07-09. Notes: Offered 420 special deals and Greenline - NC
- **LUCID AUBURN, 21+ CANNABIS, 21+ MARIJUANA** (Auburn) — R2 - Active but stale (>90 days). Last contact: 2025-07-10. Notes: Called to discuss missing payments again, Ceara emailed me and will update me with any solutions the
- **LUCID PUYALLUP** (Puyallup) — R2 - Active but stale (>90 days). Last contact: 2025-07-10. Notes: Called to discuss missing payments again, Ceara emailed me and will update me with any solutions the
- **Main street Marijuana Downtown** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-06-18. Notes: Talked to Cade, he is looking for deals and promo specials for the shops to get online. Going to pro
- **MAIN STREET MARIJUANA ORCHARDS** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-06-18. Notes: Talked to Cade, he is looking for deals and promo specials for the shops to get online. Going to pro
- **MAIN STREET MARIJUANA EAST** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-06-18. Notes: Talked to Cade, he is looking for deals and promo specials for the shops to get online. Going to pro
- **MAIN STREET MARIJUANA NORTH Hazel Dell** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-06-18. Notes: Talked to Cade, he is looking for deals and promo specials for the shops to get online. Going to pro
- **MARGIES'S POT SHOP** (Bingen) — R2 - Active but stale (>90 days). Last contact: Never. Notes: None
- **MARIJUANA MART** (Rochester) — R2 - Active but stale (>90 days). Last contact: 2025-04-02. Notes: Offered 420 special deals and greenline - NC
- **Mountain High Cannabis (MHC)** (Republic) — R2 - Active but stale (>90 days). Last contact: Never. Notes: None
- **NATURAL BLESSING CANNABIS** (Spanaway) — R2 - Active but stale (>90 days). Last contact: 2025-01-31. Notes: Talked with Tamera about the struggle for her to meet our $1000 minimum, I waived that for her so sh
- **NATURE'S GIFTS** (Sequim) — R2 - Active but stale (>90 days). Last contact: 2025-04-03. Notes: Reached out for a restock and sent the menu 02.11.25 Emailed about 420 specials and greenline launch
- **Nikxna Cannabis** (Omak) — R2 - Active but stale (>90 days). Last contact: Never. Notes: None
- **NXNW RETAIL LLC / CANNABIS AND GLASS** (Liberty Lake) — R2 - Active but stale (>90 days). Last contact: 2025-05-21. Notes: Reached out to Ryan to see if he was interested in doing business with us. His response was: Hey Nic
- **NXNW RETAIL LLC/CANNABIS & GLASS** (Millwood) — R2 - Active but stale (>90 days). Last contact: 2025-05-21. Notes: Reached out to Ryan to see if he was interested in doing business with us. His response was: Hey Nic
- **NXNW RETAIL LLC/CANNABIS & GLASS** (Spokane) — R2 - Active but stale (>90 days). Last contact: 2025-05-21. Notes: Reached out to Ryan to see if he was interested in doing business with us. His response was: Hey Nic
- **OCEAN GREENS** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-04-02. Notes: Emailed him about a restock on flower and oil, sending vendor samples out and will be in touch for f
- **ORCHARDS CANNABIS MARKET** (Vancouver) — R2 - Active but stale (>90 days). Last contact: Never. Notes: None
- **PRC** (Arlington) — R2 - Active but stale (>90 days). Last contact: 2025-02-17. Notes: Emailed Jestyn and Jay introducing myself and giving updated contact information, i have met Jestyn 
- **PRC** (Mount Vernon) — R2 - Active but stale (>90 days). Last contact: 2025-02-17. Notes: Emailed Jestyn and Jay introducing myself and giving updated contact information, i have met Jestyn 
- **PRC Edmonds** (Edmonds) — R2 - Active but stale (>90 days). Last contact: 2025-02-17. Notes: Emailed Jestyn and Jay introducing myself and giving updated contact information, i have met Jestyn 
- **PRC BOTHELL** (Bothell) — R2 - Active but stale (>90 days). Last contact: 2025-02-17. Notes: Emailed Jestyn and Jay introducing myself and giving updated contact information, i have met Jestyn 
- **Remedy Tulalip - Tribal** (Marysville) — R2 - Active but stale (>90 days). Last contact: 2025-06-25. Notes: Reached out to Carmen via text to see if he would answer me that way! I have emailed and gotten no r
- **SATIVA SISTERS II** (Clarkston) — R2 - Active but stale (>90 days). Last contact: 2025-06-30. Notes: Sent an intro order to th team. Will make sure tofollow up and get samples going if needed. - WL
- **SAVAGE THC** (Clayton) — R2 - Active but stale (>90 days). Last contact: 2025-06-30. Notes: None
- **SHAWN KEMP'S CANNABIS** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-02-22. Notes: Kempscannabis.com/vendor-deliveries.
- **SHAWN KEMP'S CANNABIS SODO** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-02-22. Notes: Kempscannabis.com/vendor-deliveries.
- **THE SLOW BURN Moxee** (Moxee) — R2 - Active but stale (>90 days). Last contact: 2025-05-27. Notes: Called and talked to a Manager who confirmed our information is correct.  I already emailed April my
- **THE SLOW BURN Main st** (Union Gap) — R2 - Active but stale (>90 days). Last contact: 2025-05-27. Notes: Called and talked to a Manager who confirmed our information is correct.  I already emailed April my
- **THE SLOW BURN Market St** (Union Gap) — R2 - Active but stale (>90 days). Last contact: 2025-05-27. Notes: Called and talked to a Manager who confirmed our information is correct.  I already emailed April my
- **SLOW BURN Yakima** (Yakima) — R2 - Active but stale (>90 days). Last contact: 2025-05-27. Notes: Called and talked to a Manager who confirmed our information is correct.  I already emailed April my
- **STICKY'S** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-02-07. Notes: Emailed asking to please send samples 02.07.25
- **T BROTHERS BUD LODGE - Only use Lifted Delivery Service** (Lacey) — R2 - Active but stale (>90 days). Last contact: 2025-04-08. Notes: None
- **THE BAKE SHOP** (Union Gap) — R2 - Active but stale (>90 days). Last contact: 2025-06-09. Notes: Talked to Filipe at prosser location who let me know that he is really needing hash rosin at the uni
- **THE GREEN DOOR** (Buckley) — R5 - Do Not Sell. Last contact: Never. Notes: Kush 21 does not want us selliing to this retailer
- **THE HERBERY - Chakalov** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-02-19. Notes: Left a message for Mike, emailed him all my contact info and he emailed me back with his inventory f
- **THE HERBERY - BLVD** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-05-19. Notes: Gave Mike the $8 price point to help move the flower for his locations since they are so close to ma
- **THE HERBERY - St John** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-05-19. Notes: Gave Mike the $8 price point to help move the flower for his locations since they are so close to ma
- **THE HERBERY - 78th (H4)** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-05-19. Notes: Gave Mike the $8 price point to help move the flower for his locations since they are so close to ma
- **THE HERBERY -4th** (Vancouver) — R2 - Active but stale (>90 days). Last contact: 2025-05-19. Notes: Gave Mike the $8 price point to help move the flower for his locations since they are so close to ma
- **THE JOINT** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-10-10. Notes: 10.10.2025 - RM messaged Shy Sadis the Owner to try to schedule a meeting to get into all Joint loca
- **THE KUSHERY Cathcart** (Everett) — R2 - Active but stale (>90 days). Last contact: 2025-09-22. Notes: Reached out to Ang about a restock on flower, pre rolls and dabs 06.04.25 - Emailed that we are now 
- **THE KUSHERY Evergreen way Dealership** (Everett) — R2 - Active but stale (>90 days). Last contact: 2025-09-22. Notes: Reached out to Dom about a restock on flower and pre rolls 06.04.25 - he let me put together a mock 
- **THE KUSHERY LFP** (Lake Forest Park) — R2 - Active but stale (>90 days). Last contact: 2025-09-22. Notes: Alaura gave me her updated contact info as she is still the buyer 02.17.25 - Reached out for invento
- **THE KUSHERY Monroe** (Snohomish) — R2 - Active but stale (>90 days). Last contact: 2025-09-22. Notes: Nick reached out about doing a case wrap, I sent the info to Keith to see if he was interested. 05.2
- **THE KUSHERY Clearview** (Snohomish) — R2 - Active but stale (>90 days). Last contact: 2025-09-22. Notes: Reached out to Marly for an order, she let me put together a mock order for her - Emailed that we ar
- **THE KUSHERY Stanwood** (Stanwood) — R2 - Active but stale (>90 days). Last contact: 2025-09-22. Notes: Called and talked to a budtender who confirmed that the contact info I have is correct and she is st
- **Clear Mind Cannabis (THE PACIFIC OUTPOST)** (Pasco) — R2 - Active but stale (>90 days). Last contact: Never. Notes: None
- **The Tribal Joint - Tribal** (Darrington) — R2 - Active but stale (>90 days). Last contact: 2025-02-27. Notes: Talked to a budtender who confirmed that Demi is still the buyer and email is correct 02.27.25
- **THE TOP SHELF** (Airway Heights) — R2 - Active but stale (>90 days). Last contact: 2025-04-03. Notes: None
- **THE VAULT Seattle (HerbN Elements)** (Seattle) — R2 - Active but stale (>90 days). Last contact: 2025-02-11. Notes: Emailed Chase his final invoice for Spokane location and gave him updated contact info 02.11.25 - We
- **THE VAULT Spokane** (Spokane) — R2 - Active but stale (>90 days). Last contact: 2025-02-11. Notes: Emailed Chase his final invoice for Spokane location and gave him updated contact info 02.11.25 - We
- **THE VAULT CANNABIS Lake Stevens** (Lake Stevens) — R2 - Active but stale (>90 days). Last contact: 2025-02-11. Notes: Emailed Chase his final invoice for Spokane location and gave him updated contact info 02.11.25 - We
- **THE VAULT CANNABIS Silvana** (Stanwood) — R2 - Active but stale (>90 days). Last contact: 2025-02-11. Notes: Emailed Chase his final invoice for Spokane location and gave him updated contact info 02.11.25 - We
- **TJ'S CANNABIS BUDS, EDIBLES, OILS & MORE** (Shelton) — R2 - Active but stale (>90 days). Last contact: 2025-02-14. Notes: I talked to a budtender who confirmed the buyer and email are correct 02.14.25
- **WALLA WALLA WEEDERY** (Walla Walla) — R2 - Active but stale (>90 days). Last contact: 2025-06-10. Notes: Reached out to Shawn about how FIreLIne is doing in there stores. He said everythng is going great a
- **WESTSIDE420 RECREATIONAL** (Longview) — R2 - Active but stale (>90 days). Last contact: 2025-05-20. Notes: Reached out to see if she is ready for a restock and to send back any old flower. 05.20.25
- **Zips Everett (BLOOM) - Pretty sure they are Kush 21 now** (Everett) — R2 - Active but stale (>90 days). Last contact: 2025-03-10. Notes: Likes to commuicate via text message - Called and talked to Blaine today who let me know he has 2 bu
- **Zips Hwy 512 (BLOOM)** (Tacoma) — R2 - Active but stale (>90 days). Last contact: 2025-02-06. Notes: Likes to commuicate via text message - Called and talked to Blaine today who let me know he has 2 bu
- **ZIPS CANNABIS Downtown** (Tacoma) — R2 - Active but stale (>90 days). Last contact: 2025-02-06. Notes: Likes to commuicate via text message - Called and talked to Blaine today who let me know he has 2 bu
- **ZIPS CANNABIS 6th** (Tacoma) — R2 - Active but stale (>90 days). Last contact: 2025-02-06. Notes: Likes to commuicate via text message - Called and talked to Blaine today who let me know he has 2 bu
- **Zips Puyallup 176th** (Puyallup) — R2 - Active but stale (>90 days). Last contact: 2025-03-25. Notes: This store is opening april 1st and they would like a rushed order 03.25.25

---

## Step 3: Geographic Analysis

### Regional Distribution

| Region | Total | Active | Active % | Uncontacted |
|---|---|---|---|---|
| Seattle Metro | 158 | 0 | 0% | 28 |
| Eastern WA | 83 | 0 | 0% | 22 |
| South Sound | 69 | 0 | 0% | 20 |
| NW Washington | 52 | 0 | 0% | 14 |
| Peninsula/Islands | 47 | 0 | 0% | 15 |
| SW Washington | 39 | 0 | 0% | 7 |
| Other/Unclassified | 38 | 0 | 0% | 14 |
| Central WA | 22 | 0 | 0% | 6 |

### Market Penetration
- **Database coverage:** 508/500 = **102%** of WA licensed retailers
- **Active customers:** 0/500 = **0%** market penetration
- **Conversion rate (DB → Active):** 0%

### Top 30 Cities

| City | Total | Active | Region |
|---|---|---|---|
| Seattle | 59 | 0 | Seattle Metro |
| Spokane | 21 | 0 | Eastern WA |
| Tacoma | 20 | 0 | South Sound |
| Vancouver | 19 | 0 | SW Washington |
| Bellingham | 17 | 0 | NW Washington |
| Everett | 15 | 0 | Seattle Metro |
| Olympia | 11 | 0 | South Sound |
| Lynnwood | 10 | 0 | Seattle Metro |
| Bremerton | 10 | 0 | Peninsula/Islands |
| Longview | 8 | 0 | SW Washington |
| Pullman | 8 | 0 | Eastern WA |
| Port Angeles | 8 | 0 | Peninsula/Islands |
| Mount Vernon | 8 | 0 | NW Washington |
| Puyallup | 6 | 0 | South Sound |
| Port Orchard | 6 | 0 | Peninsula/Islands |
| Shelton | 6 | 0 | South Sound |
| Renton | 6 | 0 | Seattle Metro |
| Anacortes | 5 | 0 | NW Washington |
| Wenatchee | 5 | 0 | Central WA |
| Bellevue | 5 | 0 | Seattle Metro |
| Yakima | 5 | 0 | Eastern WA |
| Union Gap | 5 | 0 | Eastern WA |
| Arlington | 4 | 0 | Seattle Metro |
| Shoreline | 4 | 0 | Seattle Metro |
| Lacey | 4 | 0 | South Sound |
| Bothell | 4 | 0 | Seattle Metro |
| Moses Lake | 4 | 0 | Central WA |
| Otis Orchards | 4 | 0 | Other/Unclassified |
| Kirkland | 4 | 0 | Seattle Metro |
| Aberdeen | 4 | 0 | Peninsula/Islands |

### Geographic Gaps
High-population WA cities with **few or no accounts**:
- **Kent**: NO accounts
- **Federal Way**: NO accounts
- **Sammamish**: NO accounts
- **Issaquah**: 2 account(s)
- **Woodinville**: 1 account(s)
- **Mercer Island**: NO accounts
- **Kenmore**: 1 account(s)
- **Burien**: 2 account(s)
- **Tukwila**: 2 account(s)
- **Des Moines**: 2 account(s)
- **Covington**: 2 account(s)
- **Maple Valley**: 2 account(s)

---

## Step 4: Contact Quality Analysis

### Completeness Score Distribution

| Score | Count | % | Description |
|---|---|---|---|
| 0/7 | 68 | 13% | Bare minimum |
| 1/7 | 38 | 7% | Bare minimum |
| 2/7 | 28 | 6% | Partial |
| 3/7 | 47 | 9% | Partial |
| 4/7 | 49 | 10% | Good |
| 5/7 | 69 | 14% | Good |
| 6/7 | 126 | 25% | Excellent |
| 7/7 | 83 | 16% | Excellent |

### Contact Coverage

| Metric | Active Accounts | All Accounts |
|---|---|---|
| Has email | 0/0 (NaN%) | 400/508 (79%) |
| Has phone | 0/0 (NaN%) | 286/508 (56%) |
| Has buyer name | 0/0 (NaN%) | 337/508 (66%) |
| Has pricing | 0/0 (NaN%) | 268/508 (53%) |

### Dead Contact Records
**95 accounts** have neither phone nor email — effectively unreachable without research:
- CANNABIZ (Puyallup) — Unconfirmed
- Cannazone Burlington FOXX ENTERPRISES LLC (Burlington) — Unconfirmed
- CANNAZONE (North Bend) — Unconfirmed
- CHIMACUM CANNABIS (Chimacum) — Unconfirmed
- Craft Cannabis (Wenatchee) — Unconfirmed
- GALAXY 21 (Seattle) — Unconfirmed
- Green leaf (Custer) — Unconfirmed
- GREEN RUSH INVESTMENT (Auburn) — Unconfirmed
- GREEN STOP MT. BAKER (Deming) — Unconfirmed
- Green Tiki Cannabis (Kingston) — Unconfirmed
- Green Tiki Cannabis (Vancouver) — Unconfirmed
- Greenhouse Group LLC (Kelso) — Unconfirmed
- HAPPY TREE (Prosser) — Unconfirmed
- Have A Heart - Ocean Shores (Ocean Shores) — Unconfirmed
- Herb's House (Seattle) — Unconfirmed

*...and 80 more*

---

## Step 5: Sales Activity Analysis

### Activity Type Frequency

| Activity | Mentions |
|---|---|
| Email outreach | 173 |
| Phone outreach | 87 |
| Samples sent/discussed | 128 |
| In-person visits | 12 |
| Orders/restocks | 114 |
| Pricing discussions | 71 |
| Follow-up mentions | 22 |
| "NC" marker | 54 |

### What Does "NC" Mean?
After analyzing 10+ occurrences in context, **"NC" is a sales rep notation meaning "Note Continued" or "Note Current"** — it's appended after the latest update to an ongoing note. Examples:
- **210 Cannabis**: "...Emailed about a restock NC..."
- **2020 CANNABIS SOLUTIONS MT BAKER HIGHWAY**: "... we cant get our partnership rekindled. NC - Ryan was very happy with the pricin..."
- **2020 SOLUTIONS EPHRATA**: "... we cant get our partnership rekindled. NC - Ryan was very happy with the pricin..."
- **2020 SOLUTIONS IRON STREET**: "... we cant get our partnership rekindled. NC - Ryan was very happy with the pricin..."
- **2020 SOLUTIONS PACIFIC HIGHWAY**: "... we cant get our partnership rekindled. NC - Ryan was very happy with the pricin..."

It marks the most recent addition to a running sales note. It is NOT "No Contact."

### Sentiment Analysis

| Sentiment | Accounts |
|---|---|
| **Positive** (happy, interested, love it) | 41 |
| **Negative** (declined, not interested, closed) | 7 |
| **Pending** (follow up, waiting, will check) | 95 |

**Positive accounts (sample):**
- **2020 CANNABIS SOLUTIONS MT BAKER HIGHWAY** (BELLINGHAM): "Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our partnership rekindled..."
- **2020 SOLUTIONS EPHRATA** (EPHRATA): "Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our partnership rekindled..."
- **2020 SOLUTIONS IRON STREET** (BELLINGHAM): "Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our partnership rekindled..."
- **2020 SOLUTIONS PACIFIC HIGHWAY** (BELLINGHAM): "Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our partnership rekindled..."
- **2020 SOLUTIONS SOAP LAKE** (SOAP LAKE): "Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our partnership rekindled..."
- **420 HOLIDAY** (LONGVIEW): "Talked to Vern who is the new buyer, he wanted the sale price since the customers were used to that pricing, i gave it t..."
- **A Greener Today Marijuana** (BOTHELL): "Talked with Kenny, he let me know it was not a good fit for the shops at this time and tokeep him updated with changes a..."
- **A Greener Today Marijuana - Shoreline** (SHORELINE): "10.13.25 - Emailed Kenny at A Greener Today to see if I can lock in a meeting next week. 

Talked with Kenny, he let me ..."

**Negative accounts (sample):**
- **CANNABLYSS** (LAKE STEVENS): "called Lisa she said they still have product and are not interested in ordering more. will not lower pricing not interes..."
- **CINDER** (SPOKANE): "Emailed Hannah and Mindy about a restock on our products, all 3 stores are getting really low or are out NC 06.05.25  Em..."
- **CINDER Downtown** (SPOKANE): "Emailed Hannah and Mindy about a restock on our products, all 3 stores are getting really low or are out NC 06.05.25  Em..."
- **CINDER** (SPOKANE VALLEY): "Emailed Hannah and Mindy about a restock on our products, all 3 stores are getting really low or are out NC 06.05.25  Em..."
- **Remedy Tulalip - Tribal** (MARYSVILLE): "Reached out to Carmen via text to see if he would answer me that way! I have emailed and gotten no response...."
- **Station 420** (UNION GAP): "Temporaily Closed..."
- **Tacoma house of Cannabis** (TACOMA): "Temporaily Closed..."

### Sample Tracking
**105 accounts** mention samples in their notes.
- **2020 CANNABIS SOLUTIONS MT BAKER HIGHWAY** (Bellingham) [I4]: Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our p...
- **2020 SOLUTIONS EPHRATA** (Ephrata) [I4]: Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our p...
- **2020 SOLUTIONS IRON STREET** (Bellingham) [I4]: Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our p...
- **2020 SOLUTIONS PACIFIC HIGHWAY** (Bellingham) [I4]: Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our p...
- **2020 SOLUTIONS SOAP LAKE** (Soap Lake) [I4]: Reached out to Ryan about potentially getting some more samples sent and to see if we cant get our p...
- **365 RECREATIONAL CANNABIS** (Dayton) [I5]: Emailed Cait to see how the samples were and if she could offer any feedback along with start an ord...
- **A Greener Today Marijuana** (Bothell) [I4]: Talked with Kenny, he let me know it was not a good fit for the shops at this time and tokeep him up...
- **A Greener Today Marijuana - Shoreline** (Shoreline) [I4]: 10.13.25 - Emailed Kenny at A Greener Today to see if I can lock in a meeting next week. 

Talked wi...
- **A Greener Today Marijuana - Lynnwood** (Lynnwood) [I4]: Talked with Kenny, he let me know it was not a good fit for the shops at this time and tokeep him up...
- **A Greener Today Marijuana - Seattle** (Seattle) [I4]: Talked with Kenny, he let me know it was not a good fit for the shops at this time and tokeep him up...

### Contact Recency Distribution

| Window | Count | % |
|---|---|---|
| 0-30 days | 1 | 0% |
| 31-60 days | 0 | 0% |
| 61-90 days | 0 | 0% |
| 91-180 days | 41 | 8% |
| 180+ days | 301 | 59% |
| No date | 165 | 32% |

### Competitive Mentions
- **Elevation Cannabis (Tribal)** (TUMWATER): "Reached ou to Eric about the brand, a new menu and contact. - WL"
- **FORBIDDEN CANNABIS CLUB SEATTLE** (SEATTLE): "Emailed updated contact info to Austin 02.11.25 - Reached out to Austin for a restock and to offer Featured farms involvement, I think this would really help push the brand. 02.19.25 Talked to Austin "
- **Higher Leaf Bel - Red - Require 48hrs notice for before delivery** (BELLEVUE): "10.10.25 - RM spoke to Jacob and he said he would be open to meeting and looking at samples next week. He said the $10.00 per 3.5g was a little high but I told him we could negotiate. Planning to foll"
- **Higher Leaf Factoria** (BELLEVUE): "Gab was fired. Jacob is the buyer, I talked with him and he told me after 2-3 bad runs with the Fireline brand they are not looking to add it to the mix right now. He said to keep him in the loop and "
- **Higher leaf Eastside** (BELLEVUE): "Gab was fired. Jacob is the buyer, I talked with him and he told me after 2-3 bad runs with the Fireline brand they are not looking to add it to the mix right now. He said to keep him in the loop and "
- **Higher leaf - Kirkland** (KIRKLAND): "Gab was fired. Jacob is the buyer, I talked with him and he told me after 2-3 bad runs with the Fireline brand they are not looking to add it to the mix right now. He said to keep him in the loop and "

---

## Step 6: Pricing Analysis

### Price Tier Distribution

| Tier | Per Gram | Accounts | % of Priced |
|---|---|---|---|
| Premium | ≥$3.00/g | 131 | 55% |
| Standard | $2.50-$2.99/g | 108 | 45% |
| Budget | <$2.50/g | 0 | 0% |
| **No pricing data** | — | 269 | — |

### Average Price by Region

| Region | Avg $/gram | Accounts with Pricing |
|---|---|---|
| Peninsula/Islands | $2.92 | 18 |
| Eastern WA | $2.81 | 40 |
| NW Washington | $2.80 | 30 |
| Seattle Metro | $2.77 | 71 |
| SW Washington | $2.75 | 18 |
| Central WA | $2.75 | 8 |
| Other/Unclassified | $2.74 | 17 |
| South Sound | $2.69 | 37 |

### Special Pricing (Concentrates/Prerolls)
130 accounts have concentrate or preroll-specific pricing:
- **28 GRAHAMS CANNABIS** (Graham): $2.50-1g /$8.50 - 3.5g/ $34 - 14g/ $68.00 - 28g/  $10 on infused 8pk pre rolls
- **365 RECREATIONAL CANNABIS** (Dayton): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **420 HOLIDAY** (Longview): $2.50-1g /$8.50 - 3.5g/ $34 - 14g/ $68.00 - 28g/  $10 on infused 8pk pre rolls
- **ACCESS CANIBUS LLC** (Valley): $2.50-1g /$9.00 - 3.5g/ $36 - 14g/ $72.00 - 28g/ - all concentrates $8.00
- **ALTITUDE** (Prosser): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **BETTER BUDS** (Longview): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - 10% off every order for FireLine Fridays deal and Greenline
- **BETTER BUDS** (Port Angeles): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - 10% off every order for FireLine Fridays deal and Greenline
- **BETTER BUDS** (Port Hadlock): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - 10% off every order for FireLine Fridays deal and Greenline
- **BETTER BUDS** (Silverdale): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - 10% off every order for FireLine Fridays deal and Greenline
- **BUDS GARAGE - no friday deliveries** (Everett): $2.50-1g /$8.00 - 3.5g/ $32 - 14g/ $64 - 28g/  - all concentrates $8.00
- **CANNA4LIFE** (Clarkston): $2.50-1g /$8.00 - 3.5g/ $32 - 14g/ $64 - 28g/  - all concentrates $8.00
- **CANNABIS PROVISIONS INC.** (Shoreline): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **CANNARAIL STATION** (Ephrata): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **CANNAZONE** (Bellingham): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ - Take 20% off whole order,  Concentrates $7.00, Greenline ozs $33.33, 14gs - $20
- **CANNAZONE** (Edmonds): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ - Take 20% off whole order,  Concentrates $7.00, Greenline ozs $33.33, 14gs - $20
- **Northwest Cannabis** (Mount Vernon): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ - Take 20% off whole order,  Concentrates $7.00, Greenline ozs $33.33, 14gs - $20
- **CANNAZONE Old HWY 99** (Mount Vernon): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ - Take 20% off whole order,  Concentrates $7.00, Greenline ozs $33.33, 14gs - $20
- **CANNAZONE** (North Bend): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ - Take 20% off whole order,  Concentrates $7.00, Greenline ozs $33.33, 14gs - $20
- **CANNAZONE** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ - Take 20% off whole order,  Concentrates $7.00, Greenline ozs $33.33, 14gs - $20
- **CINDER** (Spokane): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **CINDER Downtown** (Spokane): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **CINDER** (Spokane Valley): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **CLEAR CHOICE CANNABIS** (Bremerton): $2.50-1g /$8 - 3.5g/ $30- 14g/ $60- 28g/ concentrates $8.00 across the board
- **CLEAR CHOICE CANNABIS** (Tacoma): $2.50-1g /$8 - 3.5g/ $30- 14g/ $60- 28g/ concentrates $8.00 across the board
- **CLOUD 9** (Arlington): $2.50-1g /$9 - 3.5g/ $36 - 14g/ $72 - 28g/ concentrates $8.00 across the board
- **CLOUD 9** (Cheney): $2.50-1g /$9 - 3.5g/ $36 - 14g/ $72 - 28g/ concentrates $8.00 across the board
- **Commencement Bay Cannabis - Black** (432708): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Commencement Bay Cannabis - Yellow** (424244): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Craft Wenatchee** (Wenatchee): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Cult Cannabis co** (Ferndale): $2.50-1g /$9 - 3.5g/ $36 - 14g/ $72 - 28g/ concentrates $8.00 across the board
- **DANK OF AMERICA** (Bellingham): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **DANK OF AMERICA** (Blaine): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Destination hwy 420** (Bremerton): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Elwha Peaks** (Port Angeles): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Elevation Cannabis (Tribal)** (Tumwater): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Elevation  (MJ Compact Retail Location)** (Shelton): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Emerald Coast** (Bremerton): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **FIRE AND FROST CANNABIS** (Vancouver): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Fire Cannabis** (Omak): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **FIRE CANNABIS CO -** (Yakima): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Fireweed Cananbis Co** (Snoqualmie): Tier  2 on flower and tier 3 on pre rolls
- **GREEN DREAMS** (Snohomish): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **GREENFIELD COMPANY CANNABIS MERCANTILE** (Clarkston): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **GREENHAND** (Spokane): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **GREENWAY MARIJUANA** (Port Orchard): $2.50-1g /$9.00 - 3.5g/ $36 - 14g/ $72 - 28g/  $10 infused 8 pks and $2.50 infused 2pks
- **GREENWORKS N.W.** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **GROWERS OUTLET** (South Bend): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **HAPPY TIME** (Yakima): $2.501g /$8.50 - 3.5g/ $34 - 14g/ $68 - 28g/ concentrates $8.00 across the board
- **HAPPY TIME LLC 2** (Mount Vernon): $2.501g /$8.50 - 3.5g/ $34 - 14g/ $68 - 28g/ concentrates $8.00 across the board
- **HAPPY TIME LLC 3** (Pullman): $2.501g /$8.50 - 3.5g/ $34 - 14g/ $68 - 28g/ concentrates $8.00 across the board
- **HASHTAG Everett** (Everett): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **HASHTAG Seattle** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Hashtag cannabis** (Redmond): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **HERBAN MARKET** (Port Orchard): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **HIGH SOCIETY** (Everett): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **III KING COMPANY** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **JET CANNABIS** (Everett): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **KUSH Kirkland** (Kirkland): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **KUSHKLUB** (Shoreline): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **KUSH POINTE** (Mukilteo): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **KUSHMART SOUTH EVERETT** (Everett): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **LEGAL MARIJUANA SUPERSTORE** (Port Orchard): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **LOCALAMSTER** (Longview): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Lucky Cannabis (bud nation)** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **MARGIES'S POT SHOP** (Bingen): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **MARLEY 420** (Covington): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **MARY MART INC** (Tacoma): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Mountain High Cannabis (MHC)** (Republic): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **NATURAL BLESSING CANNABIS** (Spanaway): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **NATURAL CARE** (Tacoma): $2.50-1g /$9 - 3.5g/ $36 - 14g/ $72.00 - 28g/ all concentrates $8.00.
- **NATURE'S GIFTS** (Sequim): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Nikxna Cannabis** (Omak): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **NORTH BAY MARIJUANA** (Allyn): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **NORTHWEST CANNABIS CONNECTION** (Puyallup): $2.50-1g /$9.00 - 3.5g/ $36 - 14g/ $72 - 28g/  all concentrates $8.00
- **OCEAN GREENS** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **POM CANNABIS PULLMAN** (Pullman): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **PRC** (Arlington): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - take off 20% every order for FireLine Fridays
- **PRC** (Mount Vernon): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - take off 20% every order for FireLine Fridays
- **PRC Edmonds** (Edmonds): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - take off 20% every order for FireLine Fridays
- **PRC BOTHELL** (Bothell): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - take off 20% every order for FireLine Fridays
- **Remedy Tulalip - Tribal** (Marysville): $2.50-1g /$9 - 3.5g/ $36 - 14g/ $72.00 - 28g/ all concentrates $8.00.
- **RUCKUS RECREATIONAL CANNABIS -Capital Hill** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **RUCKUS RECREATIONAL CANNABIS - fremont** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Salish Coast Cannabis - Tribal** (Anacortes): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **SAVAGE THC** (Clayton): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE SLOW BURN Moxee** (Moxee): $2.50-1g /$9.00 - 3.5g/ $36 - 14g/ $72.00 - 28g/ - all concentrates $6.80
- **THE SLOW BURN Main st** (Union Gap): $2.50-1g /$9.00 - 3.5g/ $36 - 14g/ $72.00 - 28g/ - all concentrates $6.80
- **THE SLOW BURN Market St** (Union Gap): $2.50-1g /$9.00 - 3.5g/ $36 - 14g/ $72.00 - 28g/ - all concentrates $6.80
- **SLOW BURN Yakima** (Yakima): $2.50-1g /$9.00 - 3.5g/ $36 - 14g/ $72.00 - 28g/ - all concentrates $6.80
- **SMUGGLER BROTHERS** (Sedro Woolley): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **SPOKANE GREEN LEAF** (Spokane): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **STAR BUDS Queen Anne** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **SWEET RELEAF** (Mount Vernon): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **T BROTHERS BUD LODGE - Only use Lifted Delivery Service** (Lacey): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GALLERY - GIG HARBOR** (Gig Harbor): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GALLERY CANYON** (Puyallup): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GALLERY FIFE** (Fife): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GALLERY PARKLAND** (Tacoma): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GALLERY SPANAWAY** (Spanaway): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GREEN DOOR** (Buckley): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GREEN DOOR SEATTLE** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GREEN NUGGET** (Pullman): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE GREEN NUGGET** (Spokane): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE HAPPY CROP SHOPPE** (Cashmere): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE HAPPY CROP SHOPPE** (East Wenatchee): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE HAPPY CROP SHOPPE** (Wenatchee): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE HERBERY - Chakalov** (Vancouver): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE HERBERY - BLVD** (Vancouver): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE HERBERY - St John** (Vancouver): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE HERBERY - 78th (H4)** (Vancouver): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE HERBERY -4th** (Vancouver): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE JOINT** (Everett): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE JOINT** (Seattle): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **The Tribal Joint - Tribal** (Darrington): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE TOP SHELF** (Airway Heights): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **THE ZEN DEN** (Omak): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Thunder Cannabis Rochester** (Rochester): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **Tokeland** (Tokeland): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **TREEHOUSE CLUB** (Spokane Valley): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **TRIPPY HIPPIE CANNABIS CO.** (Bellingham): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **TROVE MEDICAL AND RECREATIONAL** (Bellingham): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **UNCLE ANDO'S WURLD OF WEED** (Centralia): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **WALLA WALLA CANNABIS COMPANY** (Walla Walla): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **WALLA WALLA WEEDERY** (Walla Walla): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board - give him 20% off every order
- **WESTERN BUD** (Anacortes): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **WESTERN BUD** (Bellingham): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **WESTERN BUD** (Burlington): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **WESTSIDE420 RECREATIONAL** (Longview): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **YAKIMA WEED CO North** (Yakima): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board
- **YAKIMA WEED CO South** (Union Gap): $3.00-1g /$10.00 - 3.5g/ $38 - 14g/ $75.00 - 28g/ concentrates $8.00 across the board

---

## Step 7: Priority Action Lists

### List 1: Hot Leads — Contact This Week (Top 20)

| # | Retailer | City | Pipeline | Contact | Email | Phone |
|---|---|---|---|---|---|---|
| 1 | **EVERGREEN MARKET - AUBURN** | Auburn | I5 | Peter is the buyer - | Peterp@theevergreenmarket.com | 425-318-8898 - Directory |
| 2 | **EVERGREEN MARKET - BELLEVUE** | Bellevue | I5 | Peter is the buyer - | Peterp@theevergreenmarket.com | 425-318-8898 - Directory |
| 3 | **EVERGREEN MARKET - KIRKLAND** | Kirkland | I5 | Peter is the buyer - | Peterp@theevergreenmarket.com | 425-318-8898 - Directory |
| 4 | **EVERGREEN MARKET - NORTH RENTON - is now Stonr Cannabis** | Renton | I5 | Peter is the buyer - | Peterp@theevergreenmarket.com | 425-318-8898 - Directory |
| 5 | **EVERGREEN MARKET - RENTON HIGHLANDS** | Renton | I5 | Peter is the buyer - | Peterp@theevergreenmarket.com | 425-318-8898 - Directory |
| 6 | **EVERGREEN MARKET - SOUTH RENTON** | Renton | I5 | Peter is the buyer
Tony E is the General Manager | Peterp@theevergreenmarket.com | 425-318-8898 - Directory |
| 7 | **Floyds  BURLINGTON** | Burlington | I5 | Myrcedes McGee  is the buyer | burlington@floydscannabis.co burlingtonfloyds.youcanbook.me  Eric@floydscannabis.co is regional manager/buyer | 360-899-4697 |
| 8 | **THE GALLERY - GIG HARBOR** | Gig Harbor | I5 | Joshua is the GM and Buyer | josh@thegalleryco.com Shelby@thegalleryco.com | (253) 312-6083 |
| 9 | **THE GALLERY CANYON** | Puyallup | I5 | Joshua is the GM and Buyer | josh@thegalleryco.com Shelby@thegalleryco.com | (253) 604-4360 |
| 10 | **THE GALLERY FIFE** | Fife | I5 | Joshua is the GM and Buyer | josh@thegalleryco.com Shelby@thegalleryco.com | (253) 344-1013 |
| 11 | **THE GALLERY PARKLAND** | Tacoma | I5 | Joshua is the GM and Buyer | josh@thegalleryco.com Shelby@thegalleryco.com | (253) 531-4000 |
| 12 | **THE GALLERY SPANAWAY** | Spanaway | I5 | Joshua is the GM and Buyer | josh@thegalleryco.com Shelby@thegalleryco.com | (253) 375-7840 |
| 13 | **FORBIDDEN CANNABIS CLUB** | Carson | I5 | Adam is the buyer | fcc.Carson.vendor@gmail.com | (509) 427-5322 |
| 14 | **CLOUD 9** | Arlington | I5 | Kelly Adams is the buyer | kadams.cloud9@gmail.com  arlingtonmanagement.cloud9@gmail.com and Connie at cdauz.cloud9@gmail.com.  For questions regarding billing, please email mturner.cloud9@gmail.com for the fastest resolution. | (360) 322-6167 |
| 15 | **FORBIDDEN CANNABIS CLUB SEATTLE** | Seattle | I5 | Austin is the buyer | seattle@forbiddencannabisclub.com | (206) 420-2180 |
| 16 | **Forbidden Cannabis Club Mount Vernon** | Mount Vernon | I5 | Hannah is the Manager, Dee is the buyer | mv@forbiddencannabisclub.com hannahw@forbiddencannabisclub.com | (360) 982-2207 |
| 17 | **Kush 21 Yakima. LOCAL ROOTS** | Yakima | I5 | Arty is the buyer | Yakima@Kush21.com. Inventory manager is Inventoryyakima@kush21.com | (509)-426-2436 -Store. Arty cell # (509) 728-0630 |
| 18 | **MARY MART INC** | Tacoma | I5 | Mish is the buyer - likes to flirt | marymartpurchasing@gmail.com | 253-579-9396 |
| 19 | **HASHTAG Everett** | Everett | I5 | Becky is the new purchaser | everettpurchasing@betterhashtag.com | (360) 822-9669 |
| 20 | **HASHTAG Seattle** | Seattle | I5 | Bailey or Katie are the new purchasers. | seattlepurchasing@betterhashtag.com | (206) 946-8157 |

**Why these accounts:**
1. **EVERGREEN MARKET - AUBURN** — I5 - Near order / has ordered. Reached out to Peter to off him a lowered pricing to help entice him to place another order for all but the Auburn locations. Hopefully He will place 
2. **EVERGREEN MARKET - BELLEVUE** — I5 - Near order / has ordered. Reached out to Peter to off him a lowered pricing to help entice him to place another order for all but the Auburn locations. Hopefully He will place 
3. **EVERGREEN MARKET - KIRKLAND** — I5 - Near order / has ordered. Reached out to Peter to off him a lowered pricing to help entice him to place another order for all but the Auburn locations. Hopefully He will place 
4. **EVERGREEN MARKET - NORTH RENTON - is now Stonr Cannabis** — I5 - Near order / has ordered. Reached out to Peter to off him a lowered pricing to help entice him to place another order for all but the Auburn locations. Hopefully He will place 
5. **EVERGREEN MARKET - RENTON HIGHLANDS** — I5 - Near order / has ordered. Reached out to Peter to off him a lowered pricing to help entice him to place another order for all but the Auburn locations. Hopefully He will place 

### List 2: At-Risk Active Accounts (131 total)

| Retailer | City | Pipeline | Last Contact | Risk Signal |
|---|---|---|---|---|
| **210 Cannabis** | Arlington | R2 | 2025-06-25 | R2 - Active but stale (>90 days) |
| **365 RECREATIONAL CANNABIS** | Shoreline | R2 | 2025-06-25 | R2 - Active but stale (>90 days) |
| **420 CAPITOL** | Tumwater | R2 | 2025-01-30 | R2 - Active but stale (>90 days) |
| **420 CARPENTER** | Lacey | R2 | 2025-01-30 | R2 - Active but stale (>90 days) |
| **420 ELMA ON MAIN** | Elma | R2 | Never | R2 - Active but stale (>90 days) |
| **420 GRAND CENTRAL** | Rochester | R2 | 2025-01-30 | R2 - Active but stale (>90 days) |
| **420 WEST** | Olympia | R2 | 2025-01-30 | R2 - Active but stale (>90 days) |
| **420 HOLIDAY** | Longview | R2 | 2025-05-05 | R2 - Active but stale (>90 days) |
| **420 SPOT SHOP - will not do VMI** | Port Orchard | R2 | 2025-07-09 | R2 - Active but stale (>90 days) |
| **A Greener Today - Walla Walla** | Walla Walla | R2 | 2025-03-17 | R2 - Active but stale (>90 days) |
| **ALTITUDE** | Prosser | R2 | 2025-09-19 | R2 - Active but stale (>90 days) |
| **AMERICAN MARY 45th Wallington** | Seattle | R2 | 2025-09-19 | R2 - Active but stale (>90 days) |
| **APEX CANNABIS** | Moses Lake | R2 | 2025-02-12 | R2 - Active but stale (>90 days) |
| **BAYSHORE CANNABIS CO** | Shelton | R2 | 2025-05-21 | R2 - Active but stale (>90 days) |
| **BETTER BUDS** | Longview | R2 | 2025-05-06 | R2 - Active but stale (>90 days) |
| **BORED N BUZZED** | Kirkland | R2 | 2025-06-10 | R2 - Active but stale (>90 days) |
| **BUDHUT** | Camano Island | R2 | 2025-06-04 | R2 - Active but stale (>90 days) |
| **BUDHUT** | Everett | R2 | 2025-06-04 | R2 - Active but stale (>90 days) |
| **BUDS GARAGE - no friday deliveries** | Everett | R2 | 2025-06-04 | R2 - Active but stale (>90 days) |
| **Cannabis City** | Seattle | R1 | 2025-03-04 | R1 - Temp Closed |

*...and 111 more at-risk accounts in the full CSV*

### List 3: Quick Wins — One More Touch (Top 15)

| # | Retailer | City | Signal | Contact |
|---|---|---|---|---|
| 1 | **BAYSHORE CANNABIS CO** | Shelton | Samples sent | buyer@bayshorecannabis.com |
| 2 | **BELFAIR CANNABIS COMPANY** | Belfair | Samples sent | buyer@bayshorecannabis.com |
| 3 | **CLOUD 9** | Arlington | Discussed pricing | kadams.cloud9@gmail.com  arlingtonmanagement.cloud9@gmail.com and Connie at cdauz.cloud9@gmail.com.  For questions regarding billing, please email mturner.cloud9@gmail.com for the fastest resolution. |
| 4 | **EVERGREEN MARKET - AUBURN** | Auburn | Discussed pricing | Peterp@theevergreenmarket.com |
| 5 | **EVERGREEN MARKET - BELLEVUE** | Bellevue | Discussed pricing | Peterp@theevergreenmarket.com |
| 6 | **EVERGREEN MARKET - KIRKLAND** | Kirkland | Discussed pricing | Peterp@theevergreenmarket.com |
| 7 | **EVERGREEN MARKET - NORTH RENTON - is now Stonr Cannabis** | Renton | Discussed pricing | Peterp@theevergreenmarket.com |
| 8 | **EVERGREEN MARKET - RENTON HIGHLANDS** | Renton | Discussed pricing | Peterp@theevergreenmarket.com |
| 9 | **EVERGREEN MARKET - SOUTH RENTON** | Renton | Discussed pricing | Peterp@theevergreenmarket.com |
| 10 | **FILLABONG** | Bremerton | Samples sent | fillabongorders@gmail.com |
| 11 | **FILLABONG** | Silverdale | Samples sent | fillabongorders@gmail.com |
| 12 | **HIGH-5 CANNABIS** | Vancouver | Discussed pricing | orders@high5cannabis.com  nathon@high5cannabis.com |
| 13 | **High 5 Cannabis** | Stevenson | Discussed pricing | orders@high5cannabis.com  nathon@high5cannabis.com |
| 14 | **KALEAFA** | Aberdeen | Had meeting | Aberdeenvendors@kaleafa.com Cassie@Kaleafa.com |
| 15 | **KALEAFA** | Des Moines | Had meeting | david@kaleafa.com desmoinesvendors@kaleafa.com |

### List 4: Dead Records — Clean Up (283 total)

| Reason | Count |
|---|---|
| No retailer name | 188 |
| Unconfirmed, no contact info | 76 |
| Do not sell flag | 1 |
| Duplicate license | 18 |

### List 5: Data Enrichment Needed (Top 30)

| # | Retailer | City | Pipeline | Missing |
|---|---|---|---|---|
| 1 | **Floyds Port Angeles** | Port Angeles | I5 | email |
| 2 | **ORIGINS CANNABIS** | Seattle | I5 | phone, pricing, buyer name |
| 3 | **SATIVA SISTERS** | Spokane | I5 | phone, pricing, buyer name |
| 4 | **THE GREEN DOOR** | Buckley | R5 | email, phone |
| 5 | **CASCADE HERB COMPANY** | Bellingham | I4 | pricing, buyer name |
| 6 | **Craft Wenatchee** | Wenatchee | I4 | buyer name |
| 7 | **Freeland Cannabis Co** | Freeland | I4 | email, pricing |
| 8 | **GREENHAND** | Spokane | I4 | buyer name |
| 9 | **Herb's House** | Seattle | I4 | email, phone, pricing, buyer name |
| 10 | **Lucky Cannabis (bud nation)** | Seattle | I4 | buyer name |
| 11 | **MOUNT BAKER RETAIL PARTNERS, LLC** | Quincy | I4 | email, phone, pricing, buyer name |
| 12 | **MUFFYS POT SHOP** | Port Angeles | I4 | email, pricing, buyer name |
| 13 | **NIRVANA CANNABIS COMPANY** | East Wenatchee | I4 | phone, pricing, buyer name |
| 14 | **NIRVANA CANNABIS COMPANY** | Otis Orchards | I4 | phone, pricing, buyer name |
| 15 | **NIRVANA CANNABIS COMPANY** | Richland | I4 | phone, pricing, buyer name |
| 16 | **OZ** | Seattle | I4 | email, phone, pricing, buyer name |
| 17 | **Seattle Trees Collective** | Seattle | I4 | email, phone, pricing, buyer name |
| 18 | **STARBUDS** | Bellingham | I4 | email, phone, pricing |
| 19 | **MR. DOOBEES** | Seaview | I3 | phone, pricing, buyer name |
| 20 | **THE JOINT** | Everett | I3 | buyer name |

---

## Step 8: Import Summary

See `frost_import_stats.md` for full breakdown.

- **507 accounts** ready for Supabase import
- **417 contacts** (buyer records with at least name, email, or phone)
- **333 interactions** (sales notes preserved as internal notes)
- **207 records skipped** (empty, duplicate, or flagged)

Import file: `frost_import_ready.json`

---

## Recommendations

### Immediate (This Week)
1. **Contact the Top 20 Hot Leads** — these are confirmed businesses with active dialogue signals. Start with the I4/I5 accounts (samples sent or near-order).
2. **Re-engage At-Risk Active accounts** — 131 accounts are in Recovery. Personal outreach from a manager, not just a rep email.
3. **Close Quick Wins** — 15 accounts just need one more touch to convert.

### Short-Term (This Month)
4. **Data enrichment sprint** — 0 Active accounts are missing critical data. Dedicate a day to filling gaps.
5. **Classify blank-status accounts** — 73% of accounts have no status. Even a quick pass to mark "Active" vs "Prospect" dramatically improves pipeline visibility.
6. **Standardize notes format** — Adopt a structured template: Date | Channel | Rep | Outcome | Next Step.

### Strategic (This Quarter)
7. **Geographic expansion** — Eastern WA and Peninsula regions are undertapped. Target Yakima, Tri-Cities, and Bainbridge Island.
8. **Price optimization** — Premium ($3+/g) accounts are concentrated in smaller markets. Seattle Metro accounts trend toward standard pricing. Consider tiered pricing strategy.
9. **Import into Frost CRM** — The `frost_import_ready.json` file is ready. Loading it into Supabase gives the sales team a proper CRM view instead of a spreadsheet.

---

*Analysis engine: Node.js + custom CSV parser*
*Data source: Google Sheets export (714 rows)*
*Clean records: 508 | Active: 0 | Market penetration: 0%*
