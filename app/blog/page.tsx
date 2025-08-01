'use client';
import dynamic from 'next/dynamic';
import SkeletonLoader from '../../components/skeletonLoader';
import Footer from '@/components/footer';

// Dynamically import the AllPostsPage component to avoid SSR issues
const AllPostsPage = dynamic(
  () => import('../../components/allPostPage'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>All Posts</h1>
        </div>
        <SkeletonLoader type="Posts" />
      </div>
    )
  }
);

const categoryNames = {
  'category1': 'Fitness',
  'category2': 'Nutrition', 
  'category3': 'Health & Wellness',
};

export default function BlogPage() {
  return <><AllPostsPage categoryNames={categoryNames} /><Footer /></>
  ;

}