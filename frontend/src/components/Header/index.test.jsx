import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsersContext } from "../../contexts/UsersProvider";
import Header from '.';

describe("Header", () => {
    let countUsers;
  
    beforeEach(() => {
      countUsers = 0;
    });

    const renderComponent = (component, value={countUsers}) => {
      return (
        <UsersContext.Provider value={value}>
          { component }
        </UsersContext.Provider>
      )
    }
  
    it("renders corretly the component", () => {
      const { container } = render(renderComponent(<Header/>));
  
      expect(container).toMatchSnapshot();
    });

    describe('when count of user is more than 0', () => {

      beforeEach(() => {
        countUsers = 1;
      });

      it('renders the component correctly', () => {
        render(renderComponent(<Header/>, { countUsers }));

        expect(screen.getByText(`Users: ${countUsers}`)).toBeInTheDocument();
      })
    })
  });
  