import * as React from "react"
const ProductInfo = (props) => (
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
      d="M1 7h18M1 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M1 7l2.45-4.9A2 2 0 0 1 5.24 1h9.52a2 2 0 0 1 1.8 1.1L19 7m-9-6v6"
    />
  </svg>
)
export default ProductInfo
