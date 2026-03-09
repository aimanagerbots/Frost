import { TrackingClient } from './TrackingClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackingPage({ params }: PageProps) {
  const resolved = await params;
  return <TrackingClient orderId={resolved.id} />;
}
