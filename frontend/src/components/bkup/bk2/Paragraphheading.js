import React from "react";

export default function ResponsiveHeading({ text }) {
    return (
	<div>
	    <p className="uppercase  text-center md:text-left font-bold text-gray-900 dark:text-gray-500 leading-snug mb-4 mt-4">
		{text}
	    </p>
	    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 mt-0" />
	</div>
  );
}
