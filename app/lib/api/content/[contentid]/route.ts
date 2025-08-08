import { courses } from '../data';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ contentid: string }> }
) {
    const { contentid } = await params;
    const content = courses.find((course) => course.id === parseInt(contentid));
    return Response.json({ content });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ contentid: string }> }
) {
    const { contentid } = await params;
    const data = await request.json();
    const courseIndex = courses.findIndex((course) => course.id === parseInt(contentid));
    
    if (courseIndex === -1) {
        return Response.json({ error: 'Course not found' }, { status: 404 });
    }
    
    courses[courseIndex] = { ...courses[courseIndex], ...data };
    return Response.json({ content: courses[courseIndex] });
}
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ contentid: string }> }
) {
    const { contentid } = await params;
    const courseIndex = courses.findIndex((course) => course.id === parseInt(contentid));
    
    if (courseIndex === -1) {
        return Response.json({ error: 'Course not found' }, { status: 404 });
    }
    
    courses.splice(courseIndex, 1);
    return Response.json({ success: true });
}
