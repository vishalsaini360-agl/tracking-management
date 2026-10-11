const Business = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 1v16a2 2 0 0 0 2 2h16"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m17.667 6.667-5.666 5.666L8.667 9l-4.333 4.333m13.333-6.666h-4m4 0v4"
    />
  </svg>
)
export default Business
