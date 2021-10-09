import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Accordion,
  Button,
  Form,
  Modal,
  Carousel,
} from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import AlertModal from "../../components/AlertModal/AlertModal";
import { setPreferences } from "./../../redux/SystemPreferences/actions";
import GameCard from "./../../components/GameCard/GameCard";
import { Category } from "./../../data";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { v4 as uuidv4 } from "uuid";

function SiteConfig({ user, games, systemPreferences, history }) {
  if (!user || !parseInt(user.is_admin)) history.push("/homepage");

  const bgImage = useRef(null);
  const userForm = useRef(null);
  const headerImage1 = useRef(null);
  const headerImage2 = useRef(null);
  const headerImage3 = useRef(null);
  const logoImage = useRef(null);
  const [userFormData, setUserFormData] = useState({});
  const isSuperAdmin = parseInt(user.is_super_admin) ?? 0;
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [alertErrMsg, setAlertErrMsg] = useState("");
  const [searchGameValue, setSearchGameValue] = useState("");
  const [showEditGameModal, setShowEditGameModal] = useState(false);
  const [editGame, setEditGame] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const addNewGameImageFile = useRef(null);
  const [newGameData, setNewGameData] = useState({
    title: "",
    description: "",
    price: "",
    category: 1,
    is_active: 0,
    is_featured: 0,
  });

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=get_all_users`, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);

        if (result.success) {
          setAllUsers(result.data);
        } else {
          setAlertErrMsg(result.errMsg);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setAlertErrMsg("Request Failed.");
        setShowAlertModal(!showAlertModal);
      });
  }, []);

  const setShowSuccessModalHandler = () => {
    setShowSuccessModal(!showSuccessModal);
  };

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  const handleBgImageButton = () => {
    let bgImageFile = bgImage.current.files[0];
    if (!bgImageFile) return alert("No file selected.");

    const formData = new FormData();
    formData.append("backgroundImageFile", bgImageFile);

    fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}?function=change_background_image`,
      {
        method: "POST",
        // headers: {
        //   "Content-Type": "multipart/form-data;",
        //   // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        // },
        body: formData,
      }
    )
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);

        if (result.success) {
          var currentCounter = 4;
          setShowSuccessModal(!showSuccessModal);
          setMsg(
            `BACKGOUND IMAGE CHANGED SUCCESSFULLY, PAGE WILL REFRESH AUTOMATICALLY AFTER ${currentCounter} SECONDS.`
          );

          const timer = () => {
            setTimeout(() => {
              currentCounter--;
              setMsg(
                `BACKGOUND IMAGE CHANGED SUCCESSFULLY, PAGE WILL REFRESH AUTOMATICALLY AFTER ${currentCounter} SECONDS.`
              );

              if (0 != currentCounter) timer();
              else {
                window.location.reload(false);
              }
            }, 1000);
          };
          timer();
        } else {
          setAlertErrMsg(result.errMsg);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setAlertErrMsg("Request Failed.");
        setShowAlertModal(!showAlertModal);
      });
  };

  const loadHeader = () => {
    return (
      <div
        style={{
          backgroundImage: `url(assets/images/bg_breadcrumb.jpg)`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "50px",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            padding: "100px",
          }}
        >
          Site Config
          <div style={{ fontSize: "30px", direction: "ltr" }}>
            Here you can edit products, background and more...
          </div>
        </div>
      </div>
    );
  };

  const handleAddUserButton = () => {
    let formData = new FormData();
    let validForm = true;
    let allowedEmptyFields = ["is_admin", "is_super_admin"];

    for (const key in userFormData) {
      const value = userFormData[key];
      if (!value && !allowedEmptyFields.includes(key)) {
        validForm = false;
        setIsLoading(false);
        setAlertErrMsg(`The field ${key} is required.`);
        setShowAlertModal(!showAlertModal);
        break;
      }
      formData.append(key, value);
    }

    if (!validForm) return;
    setIsLoading(true);
    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=add_user`, {
      method: "POST",
      body: formData,
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);
        if (result.success) {
          setMsg("USER ADDED SUCCESSFULLY.");
          setShowSuccessModal(!showSuccessModal);
          userForm.current.reset();
          setUserFormData({});
        } else {
          setAlertErrMsg(result.errMsg);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setAlertErrMsg("Request Failed.");
        setShowAlertModal(!showAlertModal);
      });
  };

  const userFormContent = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Form ref={userForm}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="First name"
              onChange={(e) =>
                setUserFormData({ ...userFormData, f_name: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Last name"
              onChange={(e) =>
                setUserFormData({ ...userFormData, l_name: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) =>
                setUserFormData({ ...userFormData, username: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setUserFormData({ ...userFormData, password: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Admin"
              onChange={(e) =>
                setUserFormData({ ...userFormData, is_admin: e.target.checked })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Super-Admin"
              onChange={(e) =>
                setUserFormData({
                  ...userFormData,
                  is_super_admin: e.target.checked,
                })
              }
            />
          </Form.Group>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="primary"
              style={{ width: "100%" }}
              onClick={handleAddUserButton}
            >
              Add
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  const changeBackgroundContent = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexFlow: "column",
          alignItems: "center",
        }}
      >
        <div>
          <div>
            <input
              type="file"
              name="bg_image"
              id="bg_image"
              style={{ fontWeight: "bold" }}
              ref={bgImage}
            />
          </div>
          <Button
            style={{
              width: "100%",
              marginTop: "15px",
            }}
            onClick={handleBgImageButton}
          >
            Change!
          </Button>
        </div>
        <div
          style={{
            display: isLoading ? "flex" : "none",
            justifyContent: "center",
          }}
        >
          <Loading />
        </div>
      </div>
    );
  };

  const editGameContent = () => {
    const filterGames = () => {
      let filteredGames = [];

      if (searchGameValue == "")
        return (
          <div style={{ fontWeight: "bold" }}>Please enter a game title</div>
        );

      var regex = new RegExp(searchGameValue, "i");
      games.forEach((game) => {
        if (game.title.search(regex) !== -1)
          filteredGames.push(
            <div key={uuidv4()}>
              <Button
                key={uuidv4()}
                variant=""
                style={{
                  backgroundImage: "url(assets/images/edit.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  height: "24px",
                }}
                onClick={() => {
                  setEditGame(game);
                  setShowEditGameModal(true);
                }}
              />
              <GameCard game={game} history={history} />
            </div>
          );
      });

      return filteredGames;
    };

    return (
      <div>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search a game to edit..."
              onChange={(e) => setSearchGameValue(e.target.value)}
            />
          </Form.Group>
        </Form>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {filterGames()}
        </div>
      </div>
    );
  };

  const addGameContent = () => {
    const loadItemsOptions = () => {
      let options = [];
      for (const key in Category) {
        const item = Category[key];
        options.push(
          <option style={{ textAlign: "center", direction: "ltr" }} value={key}>
            {item}
          </option>
        );
      }
      return options;
    };

    const handleAddNewGameButton = () => {
      setIsLoading(true);

      let formData = new FormData();
      let validForm = true;
      let skipFields = ["is_active", "is_featured"];
      for (const key in newGameData) {
        const value = newGameData[key];
        if (!value && !skipFields.includes(key)) {
          validForm = false;
          setIsLoading(false);
          setAlertErrMsg(`The field ${key} is required.`);
          setShowAlertModal(!showAlertModal);
          break;
        }
        formData.append(key, value);
      }

      if (!validForm) return false;

      if (!addNewGameImageFile.current.files[0]) {
        setIsLoading(false);
        setAlertErrMsg(`The upload image field is required.`);
        setShowAlertModal(!showAlertModal);
        return false;
      } else {
        formData.append("newGameImage", addNewGameImageFile.current.files[0]);
      }

      fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}?function=add_new_game`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((result) => result.json())
        .then((result) => {
          setIsLoading(false);
          if (result.success) {
            setMsg("NEW GAME ADDED SUCCESSFULLY.");
            setShowSuccessModal(!showSuccessModal);
            history.push("/homepage");
          } else {
            setAlertErrMsg(result.errMsg);
            setShowAlertModal(!showAlertModal);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setAlertErrMsg("Request Failed.");
          setShowAlertModal(!showAlertModal);
        });
    };

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexFlow: "column",
        }}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Title"
              onChange={(e) =>
                setNewGameData({ ...newGameData, title: e.target.value })
              }
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Description"
              onChange={(e) =>
                setNewGameData({ ...newGameData, description: e.target.value })
              }
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              placeholder="Price (₪)"
              onChange={(e) =>
                setNewGameData({ ...newGameData, price: e.target.value })
              }
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Select
              size="sm"
              style={{ width: "100%" }}
              onChange={(e) =>
                setNewGameData({ ...newGameData, category: e.target.value })
              }
            >
              {loadItemsOptions()}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Featured"
              onChange={(e) =>
                setNewGameData({
                  ...newGameData,
                  is_featured: e.target.checked ? 1 : 0,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active"
              onChange={(e) =>
                setNewGameData({
                  ...newGameData,
                  is_active: e.target.checked ? 1 : 0,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <input
              type="file"
              name="game_image"
              id="game_image"
              style={{ fontWeight: "bold" }}
              ref={addNewGameImageFile}
            />
          </Form.Group>
          <Button
            disabled={isLoading ? true : false}
            style={{ width: "100%" }}
            onClick={handleAddNewGameButton}
          >
            Add New Game
          </Button>
          <div
            style={{
              display: isLoading ? "flex" : "none",
              justifyContent: "center",
            }}
          >
            <Loading />
          </div>
        </Form>
      </div>
    );
  };

  const changeHeaderImagesContent = () => {
    const updateHeaderImagesButton = () => {
      let tempImage1 = headerImage1.current.files[0];
      let tempImage2 = headerImage2.current.files[0];
      let tempImage3 = headerImage3.current.files[0];
      if (!tempImage1 && !tempImage2 && !tempImage3)
        return alert("No file selected.");

      const formData = new FormData();

      formData.append("headerImage1", tempImage1);
      formData.append("headerImage2", tempImage2);
      formData.append("headerImage3", tempImage3);
      formData.append("oldHeaderImage1", systemPreferences.headerImage1);
      formData.append("oldHeaderImage2", systemPreferences.headerImage2);
      formData.append("oldHeaderImage3", systemPreferences.headerImage3);

      fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}?function=change_header_images`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((result) => result.json())
        .then((result) => {
          setIsLoading(false);

          if (result.success) {
            var currentCounter = 4;
            setShowSuccessModal(!showSuccessModal);
            setMsg(
              `HEADER IMAGES CHANGED SUCCESSFULLY, PAGE WILL REFRESH AUTOMATICALLY AFTER ${currentCounter} SECONDS.`
            );

            const timer = () => {
              setTimeout(() => {
                currentCounter--;
                setMsg(
                  `HEADER IMAGES CHANGED SUCCESSFULLY, PAGE WILL REFRESH AUTOMATICALLY AFTER ${currentCounter} SECONDS.`
                );

                if (0 != currentCounter) timer();
                else {
                  window.location.reload(false);
                }
              }, 1000);
            };
            timer();
          } else {
            setAlertErrMsg(result.errMsg);
            setShowAlertModal(!showAlertModal);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setAlertErrMsg("Request Failed.");
          setShowAlertModal(!showAlertModal);
        });
    };
    return (
      <div style={{ textAlign: "center" }}>
        <Form
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Form.Group className="mb-3">
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: "bold" }}>First header image:</div>
              <input
                type="file"
                name="header_image_1"
                id="header_image_1"
                style={{ marginLeft: "10px" }}
                ref={headerImage1}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: "bold" }}>Second header image:</div>

              <input
                type="file"
                name="header_image_2"
                id="header_image_2"
                ref={headerImage2}
                style={{ marginLeft: "10px" }}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: "bold" }}>Third header image:</div>

              <input
                type="file"
                name="header_image_3"
                id="header_image_3"
                ref={headerImage3}
                style={{ marginLeft: "10px" }}
              />
            </div>
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={updateHeaderImagesButton}>
          Update Images
        </Button>
        <div style={{ margin: "10px" }}>{isLoading && <Loading />}</div>
      </div>
    );
  };

  const changeSiteLogoContent = () => {
    const updateLogoImageButton = () => {
      let tempLogoImage = logoImage.current.files[0];

      if (!tempLogoImage) return alert("No file selected.");

      const formData = new FormData();

      formData.append("logoImage", tempLogoImage);
      formData.append("oldLogoImage", systemPreferences.logoImage);
      fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}?function=change_site_logo`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((result) => result.json())
        .then((result) => {
          setIsLoading(false);

          if (result.success) {
            var currentCounter = 4;
            setShowSuccessModal(!showSuccessModal);
            setMsg(
              `SITE LOGO IMAGE CHANGED SUCCESSFULLY, PAGE WILL REFRESH AUTOMATICALLY AFTER ${currentCounter} SECONDS.`
            );

            const timer = () => {
              setTimeout(() => {
                currentCounter--;
                setMsg(
                  `SITE LOGO IMAGE CHANGED SUCCESSFULLY, PAGE WILL REFRESH AUTOMATICALLY AFTER ${currentCounter} SECONDS.`
                );

                if (0 != currentCounter) timer();
                else {
                  window.location.reload(false);
                }
              }, 1000);
            };
            timer();
          } else {
            setAlertErrMsg(result.errMsg);
            setShowAlertModal(!showAlertModal);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          setAlertErrMsg("Request Failed.");
          setShowAlertModal(!showAlertModal);
        });
    };
    return (
      <div style={{ textAlign: "center" }}>
        <Form
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Form.Group className="mb-3">
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: "bold" }}>Logo Image:</div>
              <input
                type="file"
                name="logo_image"
                id="logo_image"
                style={{ marginLeft: "10px" }}
                ref={logoImage}
              />
            </div>
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={updateLogoImageButton}>
          Update Logo
        </Button>
        <div style={{ margin: "10px" }}>{isLoading && <Loading />}</div>
      </div>
    );
  };

  const allUsersContent = () => {
    let CarouselCards = [];
    {
      allUsers.forEach((user, key) => {
        let f_name = user.f_name;
        let l_name = user.l_name;
        let fullname = `${f_name} ${l_name}`;
        let username = user.username;
        let created_at = user.created_at;

        let style = {
          display: "flex",
          justifyContent: "center",
          flexFlow: "column",
          alignItems: "center",
        };

        CarouselCards.push(
          <Carousel.Item key={uuidv4()}>
            <div style={{ ...style }}>
              <h2>
                <i>{fullname}</i>
              </h2>
              <p>
                <span style={{ fontWeight: "bold" }}>Username: </span>
                <span>{username}</span>
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}> Added At: </span>
                <span>{created_at}</span>
              </p>
            </div>
          </Carousel.Item>
        );
      });
    }
    return (
      <Carousel
        variant="dark"
        style={{ height: "200px" }}
        touch={true}
        draggable={true}
        fade={true}
      >
        {CarouselCards}
      </Carousel>
    );
  };

  const loadContent = () => {
    return (
      //Edit (title, desc, image, quantity, set game as featured), remove.
      <div>
        <SuccessModal
          showSuccessModal={showSuccessModal}
          setShowSuccessModalHandler={setShowSuccessModalHandler}
          msg={msg}
        />
        <AlertModal
          showAlertModal={showAlertModal}
          setShowAlertModalHandler={setShowAlertModalHandler}
          errMsg={alertErrMsg}
        />
        <Accordion style={{ minHeight: "300px" }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div>
                <div style={{ fontWeight: "bold" }}>Change Site Background</div>
              </div>
            </Accordion.Header>
            <Accordion.Body>{changeBackgroundContent()}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <div style={{ fontWeight: "bold" }}>Edit Game</div>
            </Accordion.Header>
            <Accordion.Body>
              {[
                editGameContent(),
                <EditGameModal
                  showEditGameModal={showEditGameModal}
                  setShowEditGameModal={setShowEditGameModal}
                  editGame={editGame}
                  history={history}
                />,
              ]}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <div style={{ fontWeight: "bold" }}>Add New Game</div>
            </Accordion.Header>
            <Accordion.Body>{addGameContent()}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item
            eventKey="3"
            style={{ display: !isSuperAdmin ? "none" : "" }}
          >
            <Accordion.Header>
              <div style={{ fontWeight: "bold" }}>Add New User</div>
            </Accordion.Header>
            <Accordion.Body>{userFormContent()}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <div style={{ fontWeight: "bold" }}>Change Header Images</div>
            </Accordion.Header>
            <Accordion.Body>{changeHeaderImagesContent()}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5">
            <Accordion.Header>
              <div style={{ fontWeight: "bold" }}>Change Site Logo</div>
            </Accordion.Header>
            <Accordion.Body>{changeSiteLogoContent()}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6">
            <Accordion.Header>
              <div style={{ fontWeight: "bold" }}>Display All Users</div>
            </Accordion.Header>
            <Accordion.Body>{allUsersContent()}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  };
  return (
    <Container style={{ backgroundColor: "white", borderRadius: "20px" }}>
      {[loadHeader(), loadContent(), <br />]}
    </Container>
  );
}

function CarouselCard({ user }) {
  // debugger;
  let f_name = user.f_name;
  let l_name = user.l_name;
  let fullname = `${f_name} ${l_name}`;
  let username = user.username;
  let created_at = user.created_at;
  return (
    <Carousel.Item>
      <img src={`assets/images/user.png`} alt="First slide" />
      <Carousel.Caption>
        <h5>{fullname}</h5>
        <p>
          Username:<span>{username}</span>
        </p>
        <p>
          Added At:<span>{created_at}</span>
        </p>
      </Carousel.Caption>
    </Carousel.Item>
  );
}

function EditGameModal({
  showEditGameModal,
  setShowEditGameModal,
  editGame,
  history,
}) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [alertErrMsg, setAlertErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const gameImage = useRef(null);
  const [gameData, setGameData] = useState({});

  useEffect(() => {
    setGameData({
      ...gameData,
      is_active: editGame.is_active == 1 ? 1 : 0,
      is_featured: editGame.is_featured == 1 ? 1 : 0,
      category: editGame.category,
    });
  }, [showEditGameModal]);

  const setShowSuccessModalHandler = () => {
    setShowSuccessModal(!showSuccessModal);
  };

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  const handleUpdateButton = () => {
    setIsLoading(true);
    let gameDataForm = new FormData();
    for (const key in gameData) {
      const value = gameData[key];
      gameDataForm.append(key, value);
    }

    gameDataForm.append("gameImageFile", gameImage.current.files[0]);
    gameDataForm.append("id", editGame.id);
    gameDataForm.append("original_img_path", editGame.img_path);

    fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}?function=update_game_data`,
      {
        method: "POST",
        body: gameDataForm,
      }
    )
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);

        if (result.success) {
          setShowSuccessModal(!showSuccessModal);
          setMsg(`THE GAME UPDATED SUCCESSFULLY.`);
          setTimeout(() => {
            history.push("/homepage");
          }, 1500);
        } else {
          setAlertErrMsg(result.errMsg);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setAlertErrMsg("Request Failed.");
        setShowAlertModal(!showAlertModal);
      });
  };

  const handleDeleteButton = (gameId) => {
    setIsLoading(true);
    let deleteGameDataForm = new FormData();
    deleteGameDataForm.append("game_id", gameId);

    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=delete_game`, {
      method: "POST",
      body: deleteGameDataForm,
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);

        if (result.success) {
          setShowSuccessModal(!showSuccessModal);
          setMsg(`THE GAME HAVE BEEN DELETED SUCCESSFULLY.`);
          setTimeout(() => {
            history.push("/homepage");
          }, 1500);
        } else {
          setAlertErrMsg(result.errMsg);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setAlertErrMsg("Request Failed.");
        setShowAlertModal(!showAlertModal);
      });
  };

  const loadItemsOptions = () => {
    let options = [];
    for (const key in Category) {
      const item = Category[key];
      options.push(
        <option style={{ textAlign: "center", direction: "ltr" }} value={key}>
          {item}
        </option>
      );
    }
    return options;
  };

  return (
    <Modal
      show={showEditGameModal}
      onHide={() => setShowEditGameModal(!showEditGameModal)}
    >
      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModalHandler={setShowSuccessModalHandler}
        msg={msg}
      />
      <AlertModal
        showAlertModal={showAlertModal}
        setShowAlertModalHandler={setShowAlertModalHandler}
        errMsg={alertErrMsg}
      />
      <div style={{ padding: "20px" }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder={editGame.title}
              onChange={(e) =>
                setGameData({ ...gameData, title: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              as="textarea"
              placeholder={editGame.description}
              onChange={(e) =>
                setGameData({ ...gameData, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              placeholder={editGame.price}
              onChange={(e) =>
                setGameData({ ...gameData, price: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Select
              size="sm"
              style={{ width: "100%" }}
              value={gameData.category}
              onChange={(e) => {
                setGameData({ ...gameData, category: e.target.value });
              }}
            >
              {loadItemsOptions()}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Featured"
              checked={gameData.is_featured}
              onChange={(e) => {
                let checked = e.target.checked ? 1 : 0;
                // setIsFeatured(checked);
                setGameData({
                  ...gameData,
                  is_featured: checked,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active (in-stock)"
              checked={gameData.is_active}
              onChange={(e) => {
                let checked = e.target.checked ? 1 : 0;
                // setIsActive(checked);
                setGameData({
                  ...gameData,
                  is_active: checked,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <input
              type="file"
              name="game_image"
              id="game_image"
              style={{ fontWeight: "bold" }}
              ref={gameImage}
            />
          </Form.Group>
        </Form>
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loading />
          </div>
        )}
      </div>
      <Modal.Footer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="danger"
            onClick={() => handleDeleteButton(editGame.id)}
          >
            Delete Game
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowEditGameModal(!showEditGameModal)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateButton}>
            Save Changes
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

const mapStateToProps = (state) => {
  const user = state.UserReducer.userReducer;
  const { games } = state.GamesReducer.gamesReducer;
  const systemPreferences =
    state.SystemPreferencesReducer.systemPreferencesReducer;
  return { user, games, systemPreferences };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPreferences,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SiteConfig);
