import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as hookGet from "../../hooks/useGetData";
import * as hookPost from "../../hooks/usePostData";
import { TabContext } from "../../contexts";
import Games from ".";

describe("Games", () => {
  let setGamesCountMock;
  let addDataMock;

  beforeEach(() => {
    // vamos mockar o nosso hook para ter controlo total. Consoante os testes podemos mudar a resposta
    vi.spyOn(hookGet, "useGetData").mockReturnValue({
      data: {
        data: [],
      },
      isLoading: false,
    });

    // criar um mock desta funcao vai nos permitir perceber se ela foi chamada e o seu resultado.
    addDataMock = vi.fn(() => {});
    setGamesCountMock = vi.fn();

    // vamos mockar o nosso hook para ter controlo total. Consoante os testes podemos mudar a resposta
    vi.spyOn(hookPost, "usePostData").mockReturnValue({
      addData: addDataMock,
      isLoading: false,
    });
  });

  // Colocar o provider à volta do nosso componente para mimetizar a app.
  const renderComponent = (
    component,
    value = { setGamesCount: setGamesCountMock }
  ) => {
    return <TabContext.Provider value={value}>{component}</TabContext.Provider>;
  };

  it("renders the component", () => {
    const { container } = render(renderComponent(<Games />));

    expect(container).toMatchSnapshot();
  });

  describe("when the data has games", () => {
    beforeEach(() => {
      /* apesar de no beforeEach maior termos determinados valores, 
      para este teste temos que alterar novamente porque o caso é diferente.
      neste caso a nossa resposta vai ter objectos (jogos)
      */
      vi.spyOn(hookGet, "useGetData").mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              date: "22/10/2022",
              name: "Name",
              image: "url",
              team: {
                visitor: "visitor",
                home: "home",
              },
            },
          ],
        },
        isLoading: false,
      });
    });
    it("show must call the setGames", () => {
      render(renderComponent(<Games />));

      expect(setGamesCountMock).toHaveBeenCalledWith(1);
    });
  });

  describe("when is loading games", () => {
    beforeEach(() => {
      // Mais uma vez alteramos a resposta, mas desta vez queremos fingir que estamos a carregar
      vi.spyOn(hookGet, "useGetData").mockReturnValue({
        data: {
          data: [],
        },
        isLoading: true,
      });
    });
    it("renders the component with loading", () => {
      render(renderComponent(<Games />));

      expect(screen.getByText("Is Loading")).toBeInTheDocument();
    });
  });

  describe("when is happens an error", () => {
    beforeEach(() => {
      // Mais uma vez alteramos a resposta, mas desta vez queremos fingir que temos algum tipo de erro
      vi.spyOn(hookGet, "useGetData").mockReturnValue({
        data: {
          data: [],
        },
        isError: true,
      });
    });

    it("renders the component with error", () => {
      render(renderComponent(<Games />));

      expect(screen.getByText("UPPSSSS")).toBeInTheDocument();
    });
  });

  describe("when is posting", () => {
    beforeEach(() => {
      // Mais uma vez alteramos a resposta de um hook diferente
      vi.spyOn(hookPost, "usePostData").mockReturnValue({
        addData: () => {},
        isLoading: true,
      });
    });
    it("renders the component with loading", () => {
      render(renderComponent(<Games />));

      expect(screen.getByText("is Loading")).toBeInTheDocument();
    });
  });

  describe("when is fill the all inputs", () => {
    it("renders the component with inputs filled", async () => {
      render(renderComponent(<Games />));

      // Vamos procurar o input pelo seu role e nome.
      userEvent.type(
        screen.getByRole("textbox", { name: /name/i }),
        "Game Porto"
      );
      expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue(
        "Game Porto"
      );

      // Vamos procurar o input de data pelo data-test-id
      userEvent.clear(screen.getByTestId(/date/i));
      userEvent.type(screen.getByTestId(/date/i), "2020-01-02");
      expect(screen.getByTestId(/date/i)).toHaveValue("2020-01-02");

      userEvent.type(screen.getByRole("textbox", { name: /image/i }), "url");
      expect(screen.getByRole("textbox", { name: /image/i })).toHaveValue(
        "url"
      );

      // Vamos procurar o input pela label
      userEvent.type(screen.getByLabelText(/Visitor/i), "Porto");
      expect(screen.getByLabelText(/Visitor/i)).toHaveValue("Porto");

      userEvent.type(screen.getByLabelText(/Home/i), "home");
      expect(screen.getByLabelText(/Home/i)).toHaveValue("home");
    });

    it("show call add data with correct values", async () => {
      render(renderComponent(<Games />));

      // Neste caso vamos preencher o formulario com as condicoes minimas
      userEvent.type(
        screen.getByRole("textbox", { name: /name/i }),
        "Game Porto"
      );

      userEvent.clear(screen.getByTestId(/date/i));
      userEvent.type(screen.getByTestId(/date/i), "2020-01-02");

      userEvent.type(screen.getByRole("textbox", { name: /image/i }), "url");

      userEvent.type(screen.getByLabelText(/Home/i), "home");

      expect(screen.getByTestId(/submitButton/i)).toBeInTheDocument();
      userEvent.click(screen.getByTestId(/submitButton/i));

      /* Depois de clickarmos no submit do form (fingindo) queremos saber se o form 
      envia os valores correctamente para o addData. Sendo que este addData é o que 
      envia para o servidor */

      await waitFor(() => {
        expect(addDataMock).toHaveBeenCalled();
        expect(addDataMock).toHaveBeenCalledWith(
          expect.objectContaining({
            date: "2020-01-02",
            name: "Game Porto",
            image: "url",
            team: {
              home: "home",
              visitor: "",
            },
          }),
          expect.anything()
        );
      });
    });
  });
});
