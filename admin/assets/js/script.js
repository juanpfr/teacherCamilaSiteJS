function initializeMenu() {
    const menuItems = document.querySelectorAll(".menuLateral .itemMenu");  //seleciona os itens do menu

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(menu => {
                menu.style.backgroundColor = "";
                menu.style.color = "";
            });
            item.style.backgroundColor = "#D0006F";
        });
    });
}

initializeMenu(); // Executa diretamente porque o DOM já está carregado
