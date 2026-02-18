

export default function HomePage() {
  

  return (
    <main className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

<div className="flex flex-col md:flex-row gap-4">

      <div className="card w-96 bg-base-100 card-md shadow-sm">
      <div className="card-body">
        <h2 className="card-title">21</h2>
        <p>Today's Request</p>
        <div className="justify-end card-actions">
        </div>
      </div>
    </div>

<div class="card w-96 bg-base-100 card-md shadow-sm">
  <div class="card-body">
    <h2 class="card-title">4</h2>
    <p>Completed Request</p>
    <div class="justify-end card-actions">
    </div>
  </div>
</div>

<div class="card w-96 bg-base-100 card-md shadow-sm">
  <div class="card-body">
    <h2 class="card-title">11</h2>
    <p>Pending Request</p>
    <div class="justify-end card-actions">

    </div>
  </div>
</div>
</div>
    </main>
  );
}
