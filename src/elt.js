export default function elt(name) {
    let el = document.createElement(name);
    let options = Array.from(arguments).slice(1);
    let processOption = function (option) {
        if (option === null) {
            // do nothing
        } else if (typeof option === 'string') {
            processOption(document.createTextNode(option));
        } else if (option instanceof Node) {
            el.appendChild(option);
        } else if (option instanceof Array) {
            option.forEach(processOption);
        } else if (typeof option === 'number') {
            processOption(option.toString());
        } else if (typeof option === 'object') {
            Object.keys(option).forEach(function (key) {
                let value = option[key];
                if (key === 'on') {
                    Object.keys(value).forEach(function (eventName) {
                        let args = value[eventName];
                        args = args instanceof Array ? args : [args];
                        el.addEventListener.apply(el, [eventName].concat(args));
                    });
                } else if (key === 'class' && value instanceof Array) {
                    value.forEach(function (c) {
                        el.classList.add(c);
                    });
                } else {
                    el.setAttribute(key, value);
                }
            });
        }
    };
    options.forEach(processOption);
    return el;
};

elt.on = function (name, listener, options) {
    let args = [listener];
    if (options) {
        args.push(options);
    }
    return {
        on: {
            [name]: args
        }
    };
};
