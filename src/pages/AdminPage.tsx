import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonToast,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import axios from "axios";

const AdminPage: React.FC = () => {
  const [apis, setApis] = useState<any[]>([]);
  const [apiName, setApiName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gameCategory, setGameCategory] = useState("");
  const [customCategory, setCustomCategory] = useState(""); // New state for custom category input
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toggledImage, setToggledImage] = useState<string | null>(null);

  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/allApis");
      setApis(response.data.allApis);
    } catch (error) {
      setToastMessage("Failed to load APIs.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddApi = async () => {
    if (!apiName || !apiUrl) {
      setToastMessage("API Name and URL are required!");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/add", {
        api_name: apiName,
        api_url: apiUrl,
        api_image: imageUrl || "/default-thumbnail.jpg",
        game_category: customCategory || gameCategory || "Uncategorized", // Use custom category if provided
      });
      setApiName("");
      setApiUrl("");
      setImageUrl("");
      setGameCategory("");
      setCustomCategory(""); // Reset custom category input
      fetchApis();
      setToastMessage("API added successfully!");
    } catch (error) {
      setToastMessage("Failed to add API.");
    }
  };

  const handleDeleteApi = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete/${id}`);
      fetchApis();
      setToastMessage("API deleted successfully!");
    } catch (error) {
      setToastMessage("Failed to delete API.");
    }
  };

  const toggleImage = (image: string) => {
    setToggledImage((prevImage) => (prevImage === image ? null : image));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Panel</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Add New API</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput placeholder="API Name" value={apiName} onIonChange={(e) => setApiName(e.detail.value!)} />
            <IonInput placeholder="API URL" value={apiUrl} onIonChange={(e) => setApiUrl(e.detail.value!)} />
            <IonInput placeholder="Image URL (optional)" value={imageUrl} onIonChange={(e) => setImageUrl(e.detail.value!)} />

            {/* Dropdown for predefined categories */}
            <IonSelect
              placeholder="Select Category (optional)"
              value={gameCategory}
              onIonChange={(e) => setGameCategory(e.detail.value)}
            >
              <IonSelectOption value="Action">Action</IonSelectOption>
              <IonSelectOption value="Puzzle">Puzzle</IonSelectOption>
              <IonSelectOption value="Adventure">Adventure</IonSelectOption>
              <IonSelectOption value="Sports">Sports</IonSelectOption>
              <IonSelectOption value="Racing">Racing</IonSelectOption>
            </IonSelect>

            {/* Input for custom category */}
            <IonInput
              placeholder="Or type a custom category"
              value={customCategory}
              onIonChange={(e) => setCustomCategory(e.detail.value!)}
            />

            <IonButton expand="full" className="ion-margin-top" onClick={handleAddApi}>Add API</IonButton>
          </IonCardContent>
        </IonCard>

        {loading && <IonSpinner name="crescent" className="ion-margin" />}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Existing APIs</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {apis.length === 0 ? (
              <IonLabel>No APIs available.</IonLabel>
            ) : (
              <IonList>
                {apis.map((api) => (
                  <IonItem key={api._id} className="api-item">
                    <IonLabel>
                      <strong>{api.api_name}</strong>
                      <p>{api.api_url}</p>
                      <p>Category: {api.game_category || "N/A"}</p>
                    </IonLabel>
                    {api.api_image && api.api_image.startsWith("http") && (
                      <img
                        src={api.api_image}
                        alt={api.api_name}
                        width={toggledImage === api.api_image ? 250 : 70}
                        height={toggledImage === api.api_image ? 250 : 70}
                        onClick={() => toggleImage(api.api_image)}
                        style={{
                          cursor: "pointer",
                          borderRadius: "10px",
                          transition: "all 0.3s ease-in-out",
                          boxShadow: toggledImage === api.api_image ? "0px 4px 10px rgba(0,0,0,0.2)" : "none",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <IonButton color="danger" size="small" onClick={() => handleDeleteApi(api._id)}>Delete</IonButton>
                  </IonItem>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>

        <IonToast isOpen={!!toastMessage} message={toastMessage} duration={2000} onDidDismiss={() => setToastMessage("")} />
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;