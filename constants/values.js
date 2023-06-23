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
    title: 'Update dorm listing',
    content:
      "If there are any changes or new information about your dormitory, you can easily update your existing listing. It is a good practice to keep your listing up to date to provide accurate information to potential residents.\n\n1. Locate and access the 'Dorm Listing' section inside your profile.\n\n2. Find your existing dormitory listings inside.\n\n3. Tap the pencil icon to start editing your selected listing.\n\n4. Make any required modifications to the details or upload new images to showcase any updates or enhancements made to your dormitory.\n\n5. Review the updated information to ensure its accuracy and completeness.\n\n6. Save or submit the changes to update your dorm listing.",
  },
  {
    title: 'Delete dorm listing',
    content:
      "If you no longer want to list your dormitory or if it becomes unavailable, you have the option to delete your listing. However, exercise caution when deleting a listing as it will permanently remove it from the application.\n\n1. Locate and access the 'Dorm Listing' section inside your profile.\n\n2. Find your existing dormitory listings inside.\n\n3. Tap the trash icon to delete your selected listing.\n\n4. Confirm your intention to delete the listing when prompted.",
  },
  {
    title: 'View dorm listing ratings and reviews',
    content:
      "As a dorm owner, you have access to ratings and reviews about your dorm listing's performance. These insights help you understand how your dormitory is performing and make informed decisions.\n\n1. Locate and access the 'Dorm Listing' section inside your profile.\n\n2. Find your existing dormitory listings inside.\n\n3. Tap the star icon to view the reviews of your selected listing.",
  },
];

export {HEI, GENERALGUIDESECTIONS, TENANTSECTIONS, OWNERSECTIONS};
