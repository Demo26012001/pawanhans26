import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      title: 'The Spiritual Significance of Char Dham Yatra',
      excerpt: 'Discover the deep spiritual meaning behind the four sacred sites of Kedarnath, Badrinath, Gangotri, and Yamunotri.',
      author: 'Spiritual Guide',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1620734630836-4fa8203b924e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
    },
    {
      id: 2,
      title: 'Best Time to Visit Char Dham by Helicopter',
      excerpt: 'Learn about the ideal seasons for your helicopter pilgrimage and what to expect during different times of the year.',
      author: 'Travel Expert',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1768148810667-d3abb419e8cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
    },
    {
      id: 3,
      title: 'Safety and Comfort: Why Choose Helicopter Yatra',
      excerpt: 'Understanding the advantages of helicopter travel for spiritual journeys in challenging Himalayan terrain.',
      author: 'Safety Officer',
      date: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Blogs</h1>
        <p className="text-lg text-slate-700 text-center mb-12">
          Insights, stories, and guidance for your spiritual journey
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-slate-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.date).toLocaleDateString()}
                  </div>
                </div>
                <Link
                  to={`/blogs/${blog.id}`}
                  className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}