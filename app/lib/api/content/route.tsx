import { courses } from './data';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    
    const filteredCourses = query 
        ? courses.filter(course => course.name.toLowerCase().includes(query.toLowerCase()))
        : courses;
    
    return Response.json({ courses: filteredCourses });
}

export async function POST(request: Request) {
    const data = await request.json();
    return Response.json({ success: true, data });
}