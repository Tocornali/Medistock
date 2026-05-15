import StaffActivateForm from "./StaffActivateForm"

export default async function StaffActivatePage({ params }: { params: Promise<{ rut: string }> }) {
  const resolvedParams = await params;
  return <StaffActivateForm rut={resolvedParams.rut} />
}
