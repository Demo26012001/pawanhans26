export const siteConfig = {
  brandName: 'Pawan Hans Yatra',
  brandSubtitle: 'भारत सरकार का उपक्रम',
  hero: {
    title: 'Char Dham Yatra by Helicopter',
    description:
      'Fly to Kedarnath, Badrinath, Gangotri and Yamunotri in style with premium comfort, safety and spiritual peace.',
    video: 'YOUR_NEW_VIDEO_URL_HERE',  // Replace with the direct video URL
    poster: '/hero-poster.png',
    details: ['4 Days / 3 Nights', 'VIP Darshan Passes', 'Luxury Comfort', 'Scenic Himalayan Routes']
  },
  navLinks: [
    { href: '/', label: 'Home' },
    { href: '/packages', label: 'Packages' },
    { href: '/about', label: 'About Us' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blogs', label: 'Blogs' }
  ],
  gallery:  {
    recommendedRatio: '4:3',
    notes: 'Place your landscape images in public/gallery and use a 4:3 ratio for best results, e.g. 1600x1200 or 1200x900.',
    basePath: '/gallery/',
    images: [
      { file: 'gallery-1.jpg', alt: 'Himalayan helicopter landing', title: 'Helicopter Landing in Himalayas' },
      { file: 'gallery-2.jpg', alt: 'Kedarnath Temple view', title: 'Kedarnath Darshan' },
      { file: 'gallery-3.jpg', alt: 'Badrinath temple evening', title: 'Badrinath Temple' },
      { file: 'gallery-4.jpg', alt: 'Mountain road and pilgrimage', title: 'Sacred Mountain Route' },
      { file: 'gallery-5.jpg', alt: 'Pilgrims in the mountains', title: 'Pilgrimage Journey' },
      { file: 'gallery-6.jpg', alt: 'Sunrise over Himalayas', title: 'Himalayan Dawn' }
    ]
  },
  stats: [
    { value: '500+', label: 'Happy Pilgrims' },
    { value: '100%', label: 'Safe Flights' },
    { value: '24/7', label: 'Support Available' },
    { value: '4.9★', label: 'Average Rating' }
  ],
  reviews: [
    {
      name: 'Rohit Sharma',
      city: 'Haridwar',
      rating: 5,
      message: 'The helicopter ride was smooth and the service team helped us every step of the way. Kedarnath darshan was fast and comfortable.'
    },
    {
      name: 'Meena Patel',
      city: 'Ahmedabad',
      rating: 5,
      message: 'Excellent planning and warm hospitality. The stay and transfer arrangements were very well organized for our family trip.'
    },
    {
      name: 'Amit Kumar',
      city: 'Lucknow',
      rating: 4.9,
      message: 'Wonderful experience from booking to return. The pilot was professional and the views were breathtaking.'
    },
    {
      name: 'Pooja Singh',
      city: 'Kanpur',
      rating: 5,
      message: 'Very respectful staff and quick boarding process. The comfort level was amazing for our entire family.'
    },
    {
      name: 'Vishal Jain',
      city: 'Indore',
      rating: 4.8,
      message: 'Travel was safe, punctual, and everything was planned carefully. The team made our Char Dham experience memorable.'
    },
    {
      name: 'Rekha Verma',
      city: 'Bhopal',
      rating: 5,
      message: 'Amazing service with beautiful views. The team coordinated very well and ensured we had a smooth pilgrimage.'
    }
  ],
  packages: [
    {
      id: 'do-dham',
      name: 'Do Dham Yatra by Helicopter',
      duration: '2 Days / 1 Night',
      price: '₹1,25,000',
      image: 'https://images.unsplash.com/photo-1620734630836-4fa8203b924e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      rating: 4.8,
      reviews: 245,
      description: 'A short and soulful helicopter pilgrimage that covers Kedarnath and Badrinath with priority darshan and comfortable hotel stays.',
      highlights: ['Kedarnath Darshan', 'Badrinath Darshan', 'VIP Passes', 'Luxury Hotels']
    },
    {
      id: 'char-dham',
      name: 'Char Dham Yatra by Helicopter',
      duration: '4 Days / 3 Nights',
      price: '₹2,50,000',
      image: 'https://images.unsplash.com/photo-1768148810667-d3abb419e8cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      rating: 4.9,
      reviews: 387,
      description: 'Complete Char Dham in a luxurious helicopter journey with VIP darshan, premium accommodations, and expert local support.',
      highlights: ['All 4 Dhams', 'Priority Darshan', '5-Star Hotels', 'Meal Included']
    },
    {
      id: 'premium',
      name: 'Premium Char Dham Experience',
      duration: '5 Days / 4 Nights',
      price: '₹3,75,000',
      image: 'https://images.unsplash.com/photo-1695413739352-392d7f937c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      rating: 5.0,
      reviews: 156,
      description: 'An elite Char Dham pilgrimage with private helicopter flights, dedicated guide, premium resorts, and fully tailored support.',
      highlights: ['Private Helicopter', 'Personal Guide', 'Luxury Resorts', 'All Inclusive']
    }
  ],
  itinerary: [
    {
      day: 'Day 1',
      title: 'Departure from Dehradun - Kedarnath Darshan',
      activities: [
        'Morning departure from Dehradun Helipad',
        'Helicopter flight to Kedarnath (approx 45 mins)',
        'Temple Darshan with VIP priority pass',
        'Return flight to Guptkashi',
        'Overnight stay at luxury hotel'
      ]
    },
    {
      day: 'Day 2',
      title: 'Badrinath Darshan - Return to Dehradun',
      activities: [
        'Morning departure to Badrinath by helicopter',
        'Temple Darshan and aarti',
        'Visit Mana Village (last Indian village)',
        'Lunch at Badrinath',
        'Return flight to Dehradun'
      ]
    }
  ],
  inclusions: [
    'Helicopter charter for entire journey',
    'VIP darshan passes at all temples',
    'Luxury hotel accommodation',
    'All meals (breakfast, lunch, dinner)',
    'Ground transportation',
    'Professional tour guide',
    'Travel insurance',
    'Emergency medical support'
  ],
  exclusions: [
    'Personal expenses',
    'Monument entry fees (if any)',
    'Tips and gratuities',
    'Additional snacks/beverages',
    'Porter charges at temples'
  ],
  similarTours: [
    {
      name: 'Kedarnath Helicopter Tour',
      duration: '1 Day',
      price: '₹65,000',
      image: 'https://images.unsplash.com/photo-1717748973246-add112dfb5e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      rating: 4.7
    },
    {
      name: 'Badrinath Helicopter Tour',
      duration: '1 Day',
      price: '₹55,000',
      image: 'https://images.unsplash.com/photo-1717748973238-45e04886c684?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      rating: 4.6
    },
    {
      name: 'Gangotri Yamunotri Tour',
      duration: '2 Days',
      price: '₹95,000',
      image: 'https://images.unsplash.com/photo-1717748973113-3e6f03ee55db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      rating: 4.8
    },
    {
      name: 'Complete Uttarakhand Yatra',
      duration: '6 Days',
      price: '₹4,25,000',
      image: 'https://images.unsplash.com/photo-1625317201684-b5ab0b282552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      rating: 4.9
    }
  ],
  contact: {
    phone: '+91 8757092431',
    email: 'pawanhansyatra@gmail.com',
    location: 'Vijay Nagar, Indore, MP',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    support: '24/7 Emergency Support'
  }
};
