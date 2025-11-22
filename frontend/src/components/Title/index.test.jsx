import React from "react";
import { render, screen } from "@testing-library/react";
import { Title } from "./index.jsx";

describe("Title", () => {
  let text;
  let props;

  beforeEach(() => {
    text = "Hello";

    props = {
      text,
    };
  });

  it("renders corretly the component", () => {
    const { container } = render(<Title {...props} />);

    expect(container).toMatchSnapshot();
  });

  describe("when the title is secondary", () => {
    beforeEach(() => {
      props = {
        ...props,
        isSecondary: true,
      };
    });
    it("renders the title with underline", () => {
      render(<Title {...props} />);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});
