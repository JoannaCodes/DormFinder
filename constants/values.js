const HEI = [
  {label: 'Polytechnic University of the Philippines', value: 'PUP'},
  {label: 'University of the Philippines Manila', value: 'UP'},
  {label: 'Far Eastern University', value: 'FEU'},
  {label: 'University of Santo Tomas', value: 'UST'},
  {label: 'National University Manila', value: 'NU'},
  {label: 'San Beda University', value: 'SBU'},
  {label: 'Centro Escolar University', value: 'CEU'},
  {label: 'Technological University of the Philippines', value: 'TUP'},
  {label: 'De La Salle University', value: 'DLSU'},
  {label: 'Adamson University', value: 'ADU'},
];

const GENERALGUIDESECTIONS = [
  {
    title: 'Register',
    content:
      "Creating an account allows you to access additional features and personalize your experience. To create an account, follow these steps:\n\n1. Tap on the 'Signup' below.\n\n2. Choose whether to sign up using your email or your Google account.\n\n3. Enter the required information as instructed and tap the 'Signup' button.\n\n4. Once you have created an account, you can go back to the login screen and sign in using your username and password.",
  },
  {
    title: 'Login',
    content:
      "Ensure that you are using the correct credentials associated with your account to successfully log in.\n\n1. Choose your preferred login method: email, Google account, or guest mode.\n\n2. Enter the required information and click the 'Login' button.\n\n3. If you forget your password, click on the 'Forgot password' to start the password reset process.\n\n4. Once successfully logged in, you will gain access to your account and all the available features of the application.",
  },
  {
    title: 'Payment Gateway',
    content:
      "The payment feature offers a convenient and secure way for tenants and dormitory owners to use GCash for transactions. Tenants can make fast payments, while owners can easily verify and confirm them.\n\n1. Access your profile.\n\n2. Navigate to the payment section.\n\n3. Proceed by selecting 'continue.'\n\n4. In the GCash application, enter your passcode.\n\n5. For tenants: Easily access GCash to complete the payment process.\n\nFor dorm owners: Check if the tenant made payment and confirm the transaction.",
  },
  {
    title: 'Add Bookmarks',
    content:
      "The bookmark feature allows users to save and revisit dormitories or specific listings of interest, creating a personalized collection for future reference and comparison.\n\n1. Open the dorm listing you want to save.\n\n2. Tap on the heart icon located at the upper left corner of the image header in the Dorm Details section.\n\n3. To access your saved dorm listings, navigate to the Bookmarks tab.",
  },
];

const GENERALGUIDESECTIONS_FIL = [
  {
    title: 'Pagrehistro',
    content:
      "Ang paggawa ng account ay nagbibigay-daan upang ma-access ang mga karagdagang feature. Para gumawa ng account, sundin ang mga hakbang na ito:\n\n1. Pindutin ang 'Signup' sa ibaba.\n\n2. Piliin kung magsa-sign up gamit ang iyong email o ang iyong Google account.\n\n3. Ilagay ang kinakailangang impormasyon at i-tap ang 'Signup' na button.\n\n4. Pagkatapos gumawa ng account, maaari kang bumalik sa login screen at mag-sign in gamit ang iyong username at password.",
  },
  {
    title: 'Paglogin',
    content:
      "Siguraduhing ginagamit mo ang mga tamang kredensyal na nauugnay sa iyong account upang makapag-log in.\n\n1. Piliin ang iyong gustong paraan sa pag-log in: email, Google account, o guest mode.\n\n2. Ilagay ang kinakailangang impormasyon at pindutin ang 'Login' button.\n\n3. Kung nakalimutan mo ang iyong password, pindutin ang 'Nakalimutan ang password' upang simulan ang proseso ng pag-reset ng password.\n\n4. Pagkatapos makapag log in ay magkakaroon ka ng access sa iyong account",
  },
  {
    title: 'Pagbabayad',
    content:
      "Nag-aalok ang 'Payment Gateway' ng maginhawa at ligtas na paraan para sa mga nangungupahan at may-ari ng dormitoryo na gamitin ang GCash para sa mga transaksyon.\n\n1. Pindutin ang iyong profile.\n\n2. Pumunta sa seksyon ng 'Payment Gateway'.\n\n3. Magpatuloy sa pamamagitan ng pagpindot ng 'Continue.'\n\n4. Sa iyong GCash application, ilagay ang iyong passcode.\n\n5. Para sa mga nangungupahan: Madaling i-access ang GCash para makumpleto ang proseso ng pagbabayad.\n\nPara sa mga may-ari ng dorm: Suriin kung nagbayad ang tenant at kumpirmahin ang transaksyon.",
  },
  {
    title: 'Pagdagdag sa Bookmark',
    content:
      "Makatutulong ang Bookmark upang hindi mahirapan na mahanap ang mga dormitoryo na gusto mong puntahan o makita.\n\n1. Buksan ang dorm na gusto mong i-save.\n\n2. Pindutin ang icon ng puso na matatagpuan sa kaliwang sulok ng larawan ng Dorm.\n\n3. Upang ma-access ang iyong mga naka-save na listahan ng dorm, pindutin sa ibaba ang tab ng Bookmark.",
  },
];


const TENANTSECTIONS = [
  {
    title: 'Message Dorm Owner',
    content:
      "To contact the dorm owner, simply click the 'Message now' button at the bottom of the listing. This will direct you to a conversation interface for convenient and effective communication between both parties.\n\n1. Tap your desired dorm listing to access its detailed information.\n\n2. Scroll down to the bottom section of the page.\n\n3. Press the 'Message now' button to initiate a chatroom specifically for you and the dorm owner.\n\n4. Utilize the chatroom to send text messages and share images from your gallery or camera.",
  },
  {
    title: 'Report a Listing',
    content:
      "If you come across a listing that you believe violates our guidelines or contains inappropriate content, you can report it for review. Reporting a listing helps us maintain a safe and reliable platform for all users.\n\nSubmit a report\n\n1. Tap on the dorm listing you wish to report.\n\n2. Scroll down and select the 'Report this listing' option.\n\n3. A form will appear where you can provide details of your report.\n\n4. Once you have written your report, tap the submit button to send it.\n\nResolved report\n\nAfter the report is resolved, you'll receive notifications with updates on the reported listing. The response can result in either the listing being removed by the admin or the report being acknowledged and resolved.",
  },
  {
    title: 'Rate and Review a Listing',
    content:
      "Rate and review a dorm listing to share your feedback and experiences, helping others make informed decisions and improving the listing's credibility.\n\n1. Navigate to your bookmarks.\n\n2. Locate the desired dorm listing and tap the 'Write a review' button.\n\n3. Fill out the form, including your rating and written review.\n\n4. Once completed, tap the 'Submit' button.\n\nYou can view your submitted reviews by tapping the rating button in the Dorm Details section.",
  },
];

const TENANTSECTIONS_FIL = [
  {
    title: 'Pakikipag-usap sa may-ari ng dorm',
    content:
      "Para makausap ang may-ari ng dorm, pindutin lang ang button na 'Message Now'. Dadalhin ka nito sa inyong pag-uusap para sa maayos na komunikasyon.\n\n1. Pindutin ang iyong napiling dorm para ma-access ang detalyadong impormasyon nito.\n\n2. Mag-scroll pababa sa ibabang seksyon ng page.\n\n3. Pindutin ang button na 'Message Now' para simulan ang pakikipag-usap sa may-ari ng dorm.\n\n4. Maari kang magsend ng iyong text message at magbahagi ng mga larawan mula sa iyong gallery o camera.",
  },
  {
    title: 'Pagsumbong',
    content:
      "Kung makakita ka ng dormitoryong lumalabag sa aming mga alituntunin o naglalaman ng hindi naaangkop na nilalaman, maaari mo itong iulat para sa pagsusuri. \n\nMagsumite ng ulat\n\n1. Pindutin ang dorm na gusto mong iulat.\n\n2. Mag-scroll pababa at piliin ang opsyong 'Report this listing'.\n\n3. May lalabas na form kung saan makakapagbigay ka ng mga detalye ng iyong ulat.\n\n4. Kapag naisulat mo na ang iyong ulat, pindutin ang button na 'Submit'.\n\nNaresolba na ulat\n\nPagkatapos malutas ang ulat, makakatanggap ka ng notification na may update sa naiulat na listahan. Ang tugon ay maaaring magresulta na alisin ng admin ang dorm.",
  },
  {
    title: 'Pagbigay ng ratings at komento sa dorm',
    content:
      "Rate and review a dorm listing to share your feedback and experiences, helping others make informed decisions and improving the listing's credibility.\n\n1. Navigate to your bookmarks.\n\n2. Locate the desired dorm listing and tap the 'Write a review' button.\n\n3. Fill out the form, including your rating and written review.\n\n4. Once completed, tap the 'Submit' button.\n\nYou can view your submitted reviews by tapping the rating button in the Dorm Details section.",
  },
];

const OWNERSECTIONS = [
  {
    title: 'Verification',
    content:
    "Verify your profile to ensure authenticity. Provide required documentation for validation and gain a verification badge. Start uploading your own listing once verified.\n\nHere's how you can get your dormitory listing verified:\n\n1. Gather the necessary documentation to validate your dormitory listing.\n\n2. Tap on your profile to access the verification section within the application.\n\n3. You will need to provide the necessary details, such as your DTI Certificate, SEC Certificate of Registration, or any relevant supporting documents.\n\n4. Submit the information for review.\n\n5. Wait for the verification process to be completed by the application's administrators.\n\n6. Once verified, your profile will receive a verification badge, indicating its legitimacy. You can now start uploading your own listing.",
  },
  {
    title: 'Create dorm listing',
    content:
      "Create a dorm listing by providing accurate details of your dormitory. Upload attractive images to showcase your dormitory and attract potential residents.\n\n1. Navigate to the 'Dorm Listing' inside your profile.\n\n2. Tap the + button \n\n3. Enter the required information such as the dormitory name, location, amenities, pricing and more.\n\n4. Upload images of your dormitory to showcase its facilities and appearance.\n\n5. Review the information and make sure it is accurate and up-to-date.\n\n6. Submit the listing.",
  },
  {
    title: 'Edit dorm listing',
    content:
      "If there are any changes or new information about your dormitory, you can easily update your existing listing. It is a good practice to keep your listing up to date to provide accurate information to potential residents.\n\n1. Locate and access the 'Dorm Listing' section inside your profile.\n\n2. Find your existing dormitory listings inside.\n\n3. Tap the 'three dots' icon and choose 'Edit' to start editing your selected listing.\n\n4. Make any required modifications to the details or upload new images to showcase any updates or enhancements made to your dormitory.\n\n5. Review the updated information to ensure its accuracy and completeness.\n\n6. Save or submit the changes to update your dorm listing.",
  },
  {
    title: 'View dorm listing ratings and reviews',
    content:
      "As a dorm owner, you have access to ratings and reviews about your dorm listing's performance. These insights help you understand how your dormitory is performing and make informed decisions.\n\n1. Locate and access the 'Dorm Listing' section inside your profile.\n\n2. Find your existing dormitory listings inside.\n\n3. Tap the 'three dots' icon and choose 'See Reviews' to view the reviews of your selected listing.",
  },
  {
    title: 'Hide dorm listing',
    content:
      "Hiding a listing as an owner is important for reasons such as maintenance, renovation, privacy, security, or limited availability.\n\n1. Locate and access the 'Dorm Listing' section inside your profile.\n\n2. Find your existing dormitory listings inside.\n\n3. Tap the 'three dots' icon and choose 'Hide' to hide the selected listing.",
  },
  {
    title: 'Delete dorm listing',
    content:
      "If you no longer want to list your dormitory or if it becomes unavailable, you have the option to delete your listing. However, exercise caution when deleting a listing as it will permanently remove it from the application.\n\n1. Locate and access the 'Dorm Listing' section inside your profile.\n\n2. Find your existing dormitory listings inside.\n\n3. Tap the 'three dots' icon and choose 'Delete' to remove your selected listing.\n\n4. Confirm your intention to delete the listing when prompted.",
  },
];

const OWNERSECTIONS_FIL = [
  {
    title: 'Pagpapatunay',
    content:
    "Magbigay ng kinakailangang dokumentasyon para sa pagpapatunay na ikaw ay nagmamay-ari ng dorm. Simulan ang pag-upload ng sarili mong dormitoryo kapag nakumpirma na.\n\nNarito kung paano mo mapapatunayan ang listahan ng iyong dormitoryo:\n\n1. Ipunin ang kinakailangang dokumento na magpapatunay na legal ang iyong dormitoryo.\n\n2. Pindutin ang iyong profile para ma-access ang seksyon ng 'Verification'.\n\n3. Kakailanganin mong i-upload ang kinakailangan na dokumento, gaya ng iyong DTI Certificate, SEC Certificate of Registration, o anumang nauugnay na sumusuportang dokumento.\n\n4. Isumite ang impormasyon para sa pagsusuri.\n\n5. Hintaying makumpleto ng mga admin ang proseso.\n\n6. Kapag na-verify na, makakatanggap ang iyong profile ng verification badge, na nagsasaad ng pagiging lehitimo nito. Maaari mo na ngayong simulan ang pag-upload ng iyong sariling dormitoryo.",
  },
  {
    title: 'Pag-upload ng sariling dorm',
    content:
      "Mag-upload ng sariling dorm sa pamamagitan ng pagbibigay ng mga tamang detalye ng iyong dormitoryo. Mag-upload ng mga na larawan para ipakita ang iyong dormitoryo at maakit ang mga potensyal na residente.\n\n1. Hanapin at pindutin ang 'Dorm Listing' sa loob ng iyong profile.\n\n2. Pindutin ang '+' button \n\n3. Ilagay ang kinakailangang impormasyon gaya ng pangalan ng dormitoryo, lokasyon, presyo at higit pa.\n\n4. Mag-upload ng mga larawan ng iyong dormitoryo upang ipakita ang mga pasilidad at hitsura nito.\n\n5. Suriin ang impormasyon at tiyaking tama.\n\n6. Isumite ang dormitoryo.",
  },
  {
    title: 'Baguhin ang inupload na dorm',
    content:
      "Kung mayroong anumang mga pagbabago o bagong impormasyon, madali mong maa-update ang iyong kasalukuyang dormitoryo. \n\n1. Hanapin at pindutin ang 'Dorm Listing' sa loob ng iyong profile.\n\n2. Hanapin ang iyong mga kasalukuyang dormitoryo sa loob.\n\n3. Pindutin ang 'three dots' icon at piliin ang 'Edit' para simulan ang pag-edit ng iyong napiling listahan.\n\n4. Gumawa ng anumang kinakailangang pagbabago sa mga detalye o mag-upload ng mga bagong larawan.\n\n5. Suriin ang na-update na impormasyon para matiyak na ito ay tama o kompleto.\n\n6. Isumite ang mga pagbabago upang i-update ang iyong dorm.",
  },
  {
    title: 'Tingnan ang ratings at komento ng \ninupload na dorm',
    content:
      "Bilang may-ari ng dorm, mayroon kang access sa mga rating at komento tungkol sa iyong dorm. \n\n1. Hanapin at i-access ang seksyon ng 'Dorm Listing' sa loob ng iyong profile.\n\n2. Hanapin ang iyong mga kasalukuyang dormitoryo sa loob.\n\n3. Pindutin ang 'three dots' icon at piliin ang 'See Reviews' upang tingnan ang mga review ng iyong napiling dormitoryo.",
  },
  {
    title: 'Pagtago ng inupload na dorm',
    content:
      "Ang pagtatago ng dormitoryo  ay mahalaga para sa mga kadahilanan tulad ng pagsasaayos ng lugar, seguridad, o limitadong bakante. \n\n1. Hanapin at i-access ang seksyon ng 'Dorm Listing' sa loob ng iyong profile.\n\n2. Hanapin ang iyong mga kasalukuyang dormitoryo sa loob.\n\n3. Pindutin ang 'three dots' icon at piliin ang 'Hide' upang itago ang napiling dormitoryo.",
  },
  {
    title: 'Burahin ang inupload na dorm',
    content:
      "Kung nais mo na burahin ang inupload na dorm, mayroon kang opsyon na tanggalin ito. Gayunpaman, mag-ingat sa pagbura nito dahil permanente na itong mawawala.\n\n1. Hanapin at pindutin ang 'Dorm Listing' sa loob ng iyong profile.\n\n2. Hanapin ang iyong mga kasalukuyang dormitoryo sa loob.\n\n3. Pindutin ang 'three dots' icon at piliin ang 'Delete' para burahin ang iyong napiling dormitoryo.\n\n4. Kumpirmahin ang iyong intensyon na tanggalin ito.",
  },
];

export {HEI, GENERALGUIDESECTIONS, GENERALGUIDESECTIONS_FIL, TENANTSECTIONS, TENANTSECTIONS_FIL, OWNERSECTIONS, OWNERSECTIONS_FIL};
