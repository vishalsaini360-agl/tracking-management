import MainLayout from "../component/common-components/main-layout/index";
export default function ErrorPage() {
  setTimeout(() => {
    window.location.replace("/flipkart");
  }, 5000);
  return (
    <MainLayout>
      <div className={"error-page"}>
        <div className="flex justify-center items-center h-screen bg-white-600">
          <div id="error-page">
            <h1 className="lg:text-6xl font-bold text-2xl text-dark">Oops!</h1>
            <p className="text-xl text-dark">
              Something went wrong. Redirecting to Dashboard......
            </p>
            {/* <p className="text-3xl text-white">
            {error.statusText || error.message}
          </p> */}
            <div className="mt-4">
              {/* <Link
              to="/"
              className="px-5 py-2 bg-white rounded-md hover:bg-gray-100"
            >
              Home
            </Link> */}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
