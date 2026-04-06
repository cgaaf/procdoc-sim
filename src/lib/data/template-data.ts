export const fastTemplate = `**Ultrasound - Point of Care**

Performed by: **Emergency, Attending Physician, MD**

Authorized by: **Emergency, Attending Physician, MD**

Comments:  **EFAST**

**CPT FAST 93308 / 76705**

**Add CPT w Thoracic 76604**

**Required views Cardiac window (subxiphoid or parasternal long acceptable) / RUQ morrison pouch renal hepatic interface / LUQ must see top of spleen and kidney / Bladder transverse sweep**

**Extended version must include apical video clips both right and left and lateral clip at diaphragm looking for hemothorax.**

**A limited sonographic evaluation in {:19197::"Trauma blunt","Trauma penetrating","Abdominal pain"} was performed at interpreted by Attending Physician Emergency, MD at 1:46 PM.**

**The following views were obtained**

**{:19197::"All FAST Views","All E FAST Views"}**

**Views of the lungs {:19197::"Was","was NOT"} obtained**

**Findings**

**Heart {Blank single:19197::"Normal no effusion","Effusion","no obtained"}**

**RUQ /Morrison Pouch {Blank single:19197::"Normal no free fluid","Free fluid","not obtained"}**

**LUQ  {Blank single:19197::"Normal no free fluid","Free fluid","not obtained"}**

**Bladder {Blank single:19197::"Normal no free fluid","Free fluid","not obtained"}**

**Lung {Blank single:19197::"Normal lung slide","Pneumothorax","hemothorax"}**

**Limitations: none**

**Interpretation**

**{:19197::"EFAST Negative x5","FAST Negative x4","Postive pathology see findings"}**

**Additional findings:**

**@SIGNATURE@**`;

export const dvtTemplate = `**Ultrasound - Point of Care**

Performed by: **Emergency, Attending Physician, MD**

Authorized by: **Emergency, Attending Physician, MD**

Comments:  **Lower Extremity Venous Thrombosis Evaluation**

**CPT 93971**

**A limited evaluation of the lower extremity venous system was performed and interpreted by .me at .now for {:19197::"Leg pain","Leg swelling","Leg erythema","Suspected DVT","Suspected PE"}**

**Side {:19197::"Left lower extremity","Right lower extremity","Bilateral lower extremities"}**

**Two-point compression with color flow Doppler was utilized for evaluation.**

**Findings**

**Common Femoral Vein {Blank single:19197::"Completely compressible","Incompletely compressible","Clot seen within the vein","Not obtained","Indeterminate"}**

**Saphenofemoral Junction {Blank single:19197::"Completely compressible","Incompletely compressible","Clot seen within the vein","Not obtained","Indeterminate"}**

**Popliteal Vein {Blank single:19197::"Completely compressible","Incompletely compressible","Clot seen within the vein","Not obtained","Indeterminate"}**

**Limitations: None**

**Interpretation:**

**{:19197::"Negative for DVT","Positive for DVT","Indeterminate"}**

**Additional findings:**

**@SIGNATURE@**`;
