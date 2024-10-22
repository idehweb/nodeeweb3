import {useCallback, useState} from 'react';

import {
    ArrayInput,
    BooleanInput,
    Edit,
    NumberInput,
    ReferenceInput,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    useNotify,
    useTranslate
} from "react-admin";
import {
    CatRefField,
    DeliverySchedule,
    FileChips,
    List,
    OrderPaymentStatus,
    ReactAdminJalaliDateInput,
    SettingTabs,
    showFiles,
    SimpleForm
} from "@/components";
import API from "@/functions/API";
import {Val} from "@/Utils";
import {Divider, Tab, Tabs, useMediaQuery} from '@mui/material';
import {useSelector} from "react-redux";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const typeChoices3 = [
    {
        id: "is",
        name: "هست"
    },
    {
        id: "isnt",
        name: "نیست"
    }
];

const typeChoices = [
    {
        id: "تهران",
        name: "تهران"
    },
    {
        id: "شهرستان",
        name: "شهرستان"
    }
];

var valuess = {};

function returnToHome(values) {
    console.log("returnToHome", values);

}


const Form = ({children, ...props}) => {
    const t = useTranslate();
    const notify = useNotify();
    const [tab, setTab] = useState('general');

    function save(values) {
        // console.log('product values', values);
        // console.log('product valuess', valuess);
        // console.log('last values: ', values);
        if (values._id) {
            API.put("/settings/" + values._id, JSON.stringify({...values}))
                .then(({data = {}}) => {
                    notify(t("saved successfully."), {
                        type: "success"
                    });
                    if (data.success) {
                        values = [];
                        valuess = [];
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                });
        } else {

            API.post("/settings/", JSON.stringify({...values}))
                .then(({data = {}}) => {
                    notify(t("saved successfully."), {
                        type: "success"
                    });

                    if (data.success) {
                        values = [];
                        valuess = [];
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }
    }

    // const t = useTranslate();

    // @ts-ignore
    const themeData = useSelector((st) => st.themeData);

    const totals = 0;
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const handleSelect = useCallback(
        (e, v) => {
            console.log('e', e)
            console.log('v', v?.props?.value)
            setTab(v?.props?.value)
            // setFilters({...filterValues, status: v?.props?.value}, displayedFilters);
        },
        []
    );
    const handleChange = useCallback(
        (e, v) => {
            console.log('e', e)
            console.log('v', v)
            setTab(v)

            // setFilters({...filterValues, status: v}, displayedFilters);
        },
        []
    );
    return (
        <>{isSmall ? (<Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tab}
                label={t('resources.order.status')}
                onChange={handleSelect}
            >{SettingTabs().map((choice) => (<MenuItem key={choice.id} value={choice.id}>{totals[choice.name]
            ? `${choice.name} (${totals[choice.name]})`
            : choice.name}</MenuItem>))}
            </Select>) :
            (<Tabs
                variant="fullWidth"
                centered
                value={tab}
                indicatorColor="primary"
                onChange={handleChange}>
                {SettingTabs().map((choice) => (
                    <Tab
                        key={choice.id}
                        label={
                            totals[choice.name]
                                ? `${choice.name} (${totals[choice.name]})`
                                : choice.name
                        }
                        value={choice.id}
                    />
                ))}
            </Tabs>)}
            <Divider/>
            <SimpleForm {...props} onSubmit={save}>
                {tab == 'general' && <div className={'setting-in setting-general'}>
                    <BooleanInput source="siteActive" label={t("resources.settings.siteActive")}/>
                    <TextInput
                        fullWidth
                        source={"siteActiveMessage"}
                        label={t("resources.settings.siteActiveMessage")}
                    />
                    <TextInput fullWidth source={"title." + t("lan")} label={t('resources.settings.title')}/>
                    <TextInput fullWidth source={"description." + t("lan")}
                               label={t('resources.settings.description')}/>

                </div>}
                {tab == 'shop' && <div className={'setting-in setting-shop'}>
                    <BooleanInput fullWidth source="paymentActive" label={t("resources.settings.paymentActive")}/>

                    <BooleanInput fullWidth source="tax" label={t("resources.settings.tax")}/>
                    <NumberInput fullWidth source="taxAmount" label={t("resources.settings.taxAmount")}/>

                    <TextInput fullWidth source="currency" label={t('resources.settings.currency')}/>

                    <div>
                        <TextInput multiline fullWidth source="factore_shop_name"
                                   label={t('resources.settings.shop_name')}/>
                        <TextInput multiline fullWidth source="factore_shop_site_address"
                                   label={t('resources.settings.shop_site_address')}/>
                        <TextInput multiline fullWidth source="factore_shop_address"
                                   label={t('resources.settings.shop_address')}/>
                        <TextInput multiline fullWidth source="factore_shop_phoneNumber"
                                   label={t('resources.settings.shop_phoneNumber')}/>
                        <TextInput multiline fullWidth source="factore_shop_faxNumber"
                                   label={t('resources.settings.shop_faxNumber')}/>
                        <TextInput multiline fullWidth source="factore_shop_postalCode"
                                   label={t('resources.settings.shop_postalCode')}/>
                        <TextInput multiline fullWidth source="factore_shop_submitCode"
                                   label={t('resources.settings.shop_submitCode')}/>
                        <TextInput multiline fullWidth source="factore_shop_internationalCode"
                                   label={t('resources.settings.shop_internationalCode')}/>
                    </div>

                    <ArrayInput fullWidth source="data">
                        <SimpleFormIterator {...props}>
                            <TextInput
                                fullWidth
                                source={"title"}
                                label={t("resources.settings.title")}
                            />
                            <TextInput
                                fullWidth
                                source={"theid"}
                                label={t("resources.settings.theid")}
                            />
                            <TextInput
                                fullWidth
                                source={"description"}
                                label={t("resources.settings.description")}
                            />


                            <SelectInput
                                label={t("resources.settings.city")}
                                fullWidth
                                className={"mb-20"}
                                source="city"
                                choices={typeChoices}

                            />

                            <SelectInput
                                label={t("resources.settings.is_isnt")}
                                fullWidth
                                className={"mb-20"}
                                source="is"
                                choices={typeChoices3}

                            />
                            <TextInput
                                fullWidth
                                source={"priceLessThanCondition"}
                                label={t("resources.settings.priceLessThanCondition")}
                            />
                            <TextInput
                                fullWidth
                                source={"condition"}
                                label={t("resources.settings.condition")}
                            />
                            <TextInput
                                fullWidth
                                source={"priceMoreThanCondition"}
                                label={t("resources.settings.priceMoreThanCondition")}
                            />
                        </SimpleFormIterator>
                    </ArrayInput>

                </div>}

                {tab == 'authForm' && <div className={'setting-in setting-authForm'}>
                    <BooleanInput source="passwordAuthentication"
                                  label={t("resources.settings.passwordAuthentication")}/>
                    <ArrayInput source="registerExtraFields" label={t("resources.settings.registerExtraFields")}>
                        <SimpleFormIterator {...props}>
                            <TextInput
                                fullWidth
                                source={"label"}
                                label={t("resources.settings.label")}
                            />
                            <TextInput
                                fullWidth
                                source={"name"}
                                label={t("resources.settings.name")}
                            />
                            <SelectInput
                                label={t("resources.settings.type")}
                                defaultValue={"text"}
                                fullWidth

                                source="type"
                                choices={[
                                    {id: "text", name: t("resources.settings.text")},
                                    {id: "number", name: t("resources.settings.number")}
                                ]}
                            />
                            <BooleanInput source="require"
                                          label={t("resources.settings.require")}/>
                            <BooleanInput source="disabled"
                                          label={t("resources.settings.disabled")}/>

                        </SimpleFormIterator>
                    </ArrayInput>
                    <ArrayInput source="orderExtraFields" label={t("resources.settings.orderExtraFields")}>
                        <SimpleFormIterator {...props}>
                            <TextInput
                                fullWidth
                                source={"label"}
                                label={t("resources.settings.label")}
                            />
                            <TextInput
                                fullWidth
                                source={"name"}
                                label={t("resources.settings.name")}
                            />
                            <SelectInput
                                label={t("resources.settings.type")}
                                defaultValue={"text"}
                                fullWidth

                                source="type"
                                choices={[
                                    {id: "text", name: t("resources.settings.text")},
                                    {id: "number", name: t("resources.settings.number")}
                                ]}
                            />
                            <BooleanInput source="require"
                                          label={t("resources.settings.require")}/>


                        </SimpleFormIterator>
                    </ArrayInput>

                </div>}
                {tab == 'crm' && <div className={'setting-in setting-crm'}>
                    <ArrayInput source="customerStatus">
                        <SimpleFormIterator {...props}>
                            <TextInput
                                fullWidth
                                source={"title"}
                                label={t("resources.settings.title")}
                            />
                            <TextInput
                                fullWidth
                                source={"slug"}
                                label={t("resources.settings.slug")}
                            />

                        </SimpleFormIterator>
                    </ArrayInput>


                    <ArrayInput source="formStatus">
                        <SimpleFormIterator {...props}>
                            <TextInput
                                fullWidth
                                source={"title"}
                                label={t("resources.settings.title")}
                            />
                            <TextInput
                                fullWidth
                                source={"slug"}
                                label={t("resources.settings.slug")}
                            />

                        </SimpleFormIterator>
                    </ArrayInput>
                </div>}
                {tab == 'sms' && <div className={'setting-in setting-crm'}>

                    <TextInput multiline fullWidth source="sms_welcome" label={t('resources.settings.welcome')}/>
                    <TextInput multiline fullWidth source="sms_register" label={t('resources.settings.register')}/>
                    <TextInput multiline fullWidth source="sms_submitOrderNotPaying"
                               label={t('resources.settings.submitOrderNotPaying')}/>
                    <TextInput multiline fullWidth source="sms_submitOrderSuccessPaying"
                               label={t('resources.settings.submitOrderSuccessPaying')}/>
                    <TextInput multiline fullWidth source="sms_onSendProduct"
                               label={t('resources.settings.onSendProduct')}/>
                    <TextInput multiline fullWidth source="sms_onGetProductByCustomer"
                               label={t('resources.settings.onGetProductByCustomer')}/>
                    <TextInput multiline fullWidth source="sms_submitReview"
                               label={t('resources.settings.submitReview')}/>
                    <TextInput multiline fullWidth source="sms_onCancel" label={t('resources.settings.onCancel')}/>
                    <ReferenceInput
                        label={t('resources.settings.defaultSmsGateway')}
                        source="defaultSmsGateway"
                        reference="gateway"
                        perPage={1000}
                        allowEmpty
                    >
                        <SelectInput optionText={"title." + t('lan')} optionValue="id"/>
                    </ReferenceInput>
                </div>}


                {/*defaultSmsGateway*/}

                {children}
            </SimpleForm>
        </>);
};

const edit = (props) => (
    <Edit {...props}>
        <Form>

        </Form>
    </Edit>
);


export default edit;
